import { Point } from "./point";

export const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

export function to_str(direction: Point) {
  if (direction.x < 0) return '<'
  if (direction.x > 0) return '>'
  if (direction.y < 0) return '^'
  if (direction.y > 0) return 'v'
}

export function from_str(direction: string) {
  if (direction === ">") return { x: 1, y: 0 }
  if (direction === "v") return { x: 0, y: 1 }
  if (direction === "<") return { x: -1, y: 0 }
  if (direction === "^") return { x: 0, y: -1 }
}

export function dir(from: Point, to: Point) {
  if (from.x < to.x) return ">"
  if (from.x > to.x) return "<"
  if (from.y < to.y) return "v"
  if (from.y > to.y) return "^"
}
