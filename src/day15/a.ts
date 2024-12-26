import { get, Grid, grid, identity, print, reduce_grid, set, find_grid } from '../utils/grid';
import { move, p, Point } from '../utils/point';

function parse(data: string[]): [Grid<string>, Point[]] {
  const splitIndex = data.findIndex(line => !line)

  return [
    grid(data.slice(0, splitIndex), identity),
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
  return find_grid(map, (y, x, v) => v === '@' ? p(x, y) : null)
}

function step(map: Grid<string>, position: Point, direction: Point) {
  const new_pos = move(position, direction)

  const v = get(map, new_pos)

  if (v === '.') {
    set(map, position, '.')
    set(map, new_pos, '@')
    return new_pos
  } else if (v === 'O') {
    const candidates: Point[] = []
    let box_pos = new_pos
    while (get(map, box_pos) === 'O') {
      candidates.push(box_pos)
      box_pos = move(box_pos, direction)
    }
    if (get(map, box_pos) === '.') {
      // we can move all candidates
      for (let bi = candidates.length - 1; bi >= 0; bi--) {
        map[box_pos.y][box_pos.x] = 'O'
        box_pos = candidates[bi]
      }
      set(map, position, '.')
      set(map, new_pos, '@')
      return new_pos
    } else {
      // do nothing because there is a # wall
    }
  } else {
    // v is # wall so do nothing
  }

  return position
}

export function day15a(data: string[]) {
  const [map, instructions] = parse(data)

  let pos = find_robot(map)

  for (const instr of instructions) {
    pos = step(map, pos, instr)
  }

  print(map)

  return reduce_grid(map, (curr, [x, y, v]) => curr + (v === 'O' ? (100 * y) + x : 0), 0);
}
