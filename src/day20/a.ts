import { DIRECTIONS } from '../utils/direction';
import { find_grid, get, Grid, grid, identity } from '../utils/grid';
import { key, move, Point } from '../utils/point';

function find_neighbours(map: Grid<string>, p: Point) {
  return DIRECTIONS.map(d => move(p, d)).filter(dp => get(map, dp) !== "#")
}

function find_path(map: Grid<string>, start: Point, end: Point) {
  const queue = [start]
  const seen = new Set()
  const path = []

  while (queue.length) {
    const curr = queue.shift()

    path.push(curr)

    if (key(curr) === key(end)) {
      return path
    }

    seen.add(key(curr))

    for (const n of find_neighbours(map, curr).filter(n => !seen.has(key(n)))) {
      queue.push(n)
    }
  }

  return path
}

function find_neighbours_through_walls(map: Grid<string>, p: Point) {
  return DIRECTIONS
    .map(d => {
      const first = move(p, d)
      const second = move(first, d)
      return [first, second]
    })
    .filter(([first, second]) => get(map, first) === '#' && get(map, second) !== '#')
    .map(([_, second]) => second)
}

function find_cheats(map: Grid<string>, path: Point[]) {
  const index_map = new Map(path.map((p, i) => [key(p), i]))
  const cheats = []
  for (const [i, p] of path.entries()) {
    for (const cheat of find_neighbours_through_walls(map, p)) {
      const ci = index_map.get(key(cheat))
      if (ci > i) {
        cheats.push((path.length - (i + 1 + (path.length - ci + 1))))
      }
    }
  }

  return cheats.toSorted((a, b) => a - b)
}

export function day20a(data: string[]) {
  const map = grid(data, identity)
  const start = find_grid(map, (x, y, c) => c === 'S')
  const goal = find_grid(map, (x, y, c) => c === 'E')
  const path = find_path(map, start, goal)
  const cheats = find_cheats(map, path)

  return cheats.filter(c => c >= 100).length;
}
