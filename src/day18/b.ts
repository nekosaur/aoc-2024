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

export function day18b(data: string[]) {
  for (let i = 1024; i < data.length; i++) {
    const size = 71
    const map = parse(data, size, size, i)

    const path = a_star(map, from_key("0:0"), from_key(`${size - 1}:${size - 1}`))

    if (!path) {
      const pos = data.slice(0, i).at(-1)
      if (DEBUG) print(map, new Map([[pos.split(',').join(':'), 'Ö']]))
      return pos
    }
  }

  throw new Error("Oops, we should have found a solution!")
}
