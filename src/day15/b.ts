import { get, Grid, print, reduce_grid, set, find_grid } from '../utils/grid';
import { from_key, key, move, p, Point } from '../utils/point';

function parse(data: string[]): [Grid<string>, Point[]] {
  const splitIndex = data.findIndex(line => !line)

  const lines = data.slice(0, splitIndex)

  const grid = []
  for (let y = 0; y < lines.length; y++) {
    const row = []
    for (let x = 0; x < lines[0].length; x++) {
      const c = lines[y][x]
      if (c === 'O') {
        row.push('[', ']')
      } else if (c === '@') {
        row.push(c, '.')
      } else {
        row.push(c, c)
      }
    }
    grid.push(row)
  }

  return [
    grid,
    data.slice(splitIndex + 1).join('').split("").map(dir => {
      switch (dir) {
        case "<": return p(-1, 0)
        case "^": return p(0, -1)
        case ">": return p(1, 0)
        case "v": return p(0, 1)
      }
    })
  ]
}

function find_robot(map: Grid<string>) {
  return find_grid(map, (y, x, v) => v === '@')
}

type Side = '[' | ']'

function is_box(value: string): value is Side {
  return ['[', ']'].includes(value)
}

function flip_direction(direction: Point) {
  return { x: direction.x * -1, y: direction.y * -1 }
}

function other_side(side: Side) {
  return side === '[' ? ']' : '['
}

function other_side_pos(position: Point, side: Side) {
  return side === ']' ? move(position, { x: -1, y: 0 }) : move(position, { x: 1, y: 0 })
}

function push_horizontal(map: Grid<string>, position: Point, new_position: Point, direction: Point) {
  const side = direction.x > 0 ? '[' : ']'
  const other = other_side(side)
  const candidates: Point[] = []
  let box_pos = new_position
  while (get(map, box_pos) === side) {
    candidates.push(box_pos)
    box_pos = move(move(box_pos, direction), direction)
  }
  const other_direction = flip_direction(direction)
  if (get(map, box_pos) === '.') {
    // we can move all candidates
    for (let bi = candidates.length - 1; bi >= 0; bi--) {
      map[box_pos.y][box_pos.x] = other
      map[box_pos.y][box_pos.x + other_direction.x] = side
      box_pos = candidates[bi]
    }
    set(map, position, '.')
    set(map, new_position, '@')
    return new_position
  } else {
    // do nothing because there is a # wall
  }

  return position
}

function push_vertical(map: Grid<string>, position: Point, new_position: Point, direction: Point) {
  const queue = [new_position]

  const seen: Set<string> = new Set()

  while (queue.length) {
    const p = queue.shift()
    const v = get(map, p)

    if (v === '#') {
      // If we find any walls in any of the candidate positions, then we can't move anything
      return position
    }

    if (is_box(v)) {
      const other_pos = other_side_pos(p, v)
      seen.add(key(p))
      seen.add(key(other_pos))

      queue.push(move(p, direction), move(other_pos, direction))
    }
  }

  const sides = [...seen.values()].map(from_key).sort((a, b) => direction.y < 0 ? a.y - b.y : b.y - a.y)

  for (const side of sides) {
    set(map, move(side, direction), get(map, side))
    set(map, side, '.')
  }

  set(map, position, '.')
  set(map, new_position, '@')

  return new_position
}

function step(map: Grid<string>, position: Point, direction: Point) {
  const new_pos = move(position, direction)

  const v = get(map, new_pos)

  if (v === '.') {
    set(map, position, '.')
    set(map, new_pos, '@')
    return new_pos
  } else if (is_box(v)) {
    const push_fn = direction.y === 0 ? push_horizontal : push_vertical

    return push_fn(map, position, new_pos, direction)
  } else {
    // v is # wall so do nothing
  }

  return position
}

export function day15b(data: string[]) {
  const [map, instructions] = parse(data)

  let pos = find_robot(map)

  print(map)

  for (const instr of instructions) {
    pos = step(map, pos, instr)
  }

  return reduce_grid(map, (curr, [x, y, v]) => curr + (v === '[' ? (100 * y) + x : 0), 0);
}
