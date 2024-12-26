export type Point = {
  x: number
  y: number
}

export function p(x: number, y: number) {
  return { x, y }
}

export function key(point: Point) {
  return `${point.x}:${point.y}`
}

export function from_key(key: string) {
  const [x, y] = key.split(':').map(Number)
  return { x, y}
}

export function move(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y }
}
