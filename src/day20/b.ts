import { DIRECTIONS } from '../utils/direction';
import { distance, find_grid, get, Grid, grid, identity } from '../utils/grid';
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

function is_cheat(from: number, to: number, distance: number) {
  return to - from > distance && distance <= 20
}

function find_cheats(path: Point[]) {
  const cheats: Record<string, number[]> = {}

  for (let i = 0; i < path.length - 1; i++) {
    const found = []
    for (let j = i + 1; j < path.length; j++) {
      const a = path[i]
      const b = path[j]
      const d = distance(a, b)
      if (is_cheat(i, j, d)) {
        found.push((j - i) - d)
      }
    }
    cheats[key(path[i])] = found
  }

  return Object.values(cheats).flat()
}

export function day20b(data: string[]) {
  const map = grid(data, identity)
  const start = find_grid(map, (x, y, c) => c === 'S')
  const goal = find_grid(map, (x, y, c) => c === 'E')
  const path = find_path(map, start, goal)
  const cheats = find_cheats(path)

  return cheats.filter(c => c >= 100).length;
}
