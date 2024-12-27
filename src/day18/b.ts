import { print } from '../utils/grid';
import { a_star } from '../utils/pathfinding';
import { from_key } from '../utils/point';

function parse(data: string[], width: number, height: number, bytes?: number) {
  const map = [...Array(height).keys()].map(() => Array(width).fill('.'))

  for (const byte of data.slice(0, bytes ?? data.length)) {
    const [x, y] = byte.split(',').map(Number)

    map[y][x] = '#'
  }

  return map
}

const DEBUG = false

function solve(data: string[]) {
  let first = 1024
  let last = data.length
  const size = 71

  const start = from_key("0:0")
  const goal = from_key(`${size - 1}:${size - 1}`)

  while (true) {
    const mid = first + Math.floor((last - first) / 2)

    if (mid === first) {
      if (DEBUG) print(parse(data, size, size, first))
      return data[first]
    }

    if (a_star(parse(data, size, size, mid), start, goal)) {
      first = mid
    } else {
      last = mid
    }
  }
}

export function day18b(data: string[]) {
  return solve(data)
}
