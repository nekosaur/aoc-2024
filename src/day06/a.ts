import { Point } from "../utils/point"

enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST
}

type Position = {
  dir: Direction
} & Point

function parseDirection(dir: string) {
  switch (dir) {
    case "^": return Direction.NORTH
    case ">": return Direction.EAST
    case "v": return Direction.SOUTH
    case "<": return Direction.WEST
  }
}

function findGuard(map: string[][]) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (!["#", "."].includes(map[y][x])) {
        return { y, x, dir: parseDirection(map[y][x]) }
      }
    }
  }
}

function outside(map: string[][], point: Point) {
  return (point.x < 0 || point.x >= map[0].length) || (point.y < 0 || point.y >= map.length)
}

function get(map: string[][], pos: Position) {
  switch (pos.dir) {
    case Direction.NORTH: return { x: pos.x, y: pos.y - 1 }
    case Direction.EAST: return { x: pos.x + 1, y: pos.y }
    case Direction.SOUTH: return { x: pos.x, y: pos.y + 1 }
    case Direction.WEST: return { x: pos.x - 1, y: pos.y }
  }
}

function run(map: string[][], start: Position) {
  let curr = { ...start }
  const visited = new Set()
  while (!outside(map, curr)) {
    visited.add(`${curr.y}|${curr.x}`)
    const front = get(map, curr)

    if (map[front.y]?.[front.x] === "#") {
      curr.dir = (curr.dir + 1) % 4;
    } else {
      curr = { ...front, dir: curr.dir }
    }
  }

  return visited.size
}

export function day6a(data: string[]) {
  const map = data.map(line => line.split(""))

  const start = findGuard(map)

  const visited = run(map, start)

  return visited;
}
