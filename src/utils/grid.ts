import { key, p, Point } from "./point"

export type Grid<T> = T[][]

export const identity = (value: string) => value

export function grid<T>(data: string[], transform: (value: string) => T): Grid<T> {
    return data.map(line => line.split("").map(transform))
}

export function clone_grid<T>(grid: Grid<T>) {
  return grid.map(row => [...row])
}

export function get<T>(grid: Grid<T>, pos: Point) {
  return grid[pos.y]?.[pos.x]
}

export function set<T>(grid: Grid<T>, pos: Point, value: T) {
  if (grid[pos.y]?.[pos.x]) {
    grid[pos.y][pos.x] = value
  }
}

export function distance(a: Point, b: Point) {
  return Math.abs(b.x - a.x) + Math.abs(b.y - a.y)
}

export function find_grid<T, U>(grid: Grid<T>, callback: (y: number, x: number, value: T) => U) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (callback(y, x, grid[y]?.[x])) {
        return p(x, y)
      }
    }
  }
}

export function reduce_grid<T, U>(grid: Grid<T>, callback: (curr: U, item: [number, number, T]) => U, initial: U): U {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      initial = callback(initial, [x, y, get(grid, p(x, y))])
    }
  }
  return initial
}

export function print<T>(grid: Grid<T>, points?: Map<string, string>, separator?: string) {
  for (let y = 0; y < grid.length; y++) {
    const row = []
    for (let x = 0; x < grid[0].length; x++) {
      const p = points?.get(key({ x, y }))

      row.push(p ?? grid[y][x])
    }
    console.log(row.join(separator ?? ''))
  }
}
