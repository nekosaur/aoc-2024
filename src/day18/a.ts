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

export function day18a(data: string[]) {
  const size = 71
  const bytes = 1024
  const map = parse(data, size, size, bytes)

  if (DEBUG) print(map)

  const path = a_star(map, from_key("0:0"), from_key(`${size - 1}:${size - 1}`))

  return path[0];
}
