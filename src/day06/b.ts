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

function next(pos: Position) {
  switch (pos.dir) {
    case Direction.NORTH: return { x: pos.x, y: pos.y - 1 }
    case Direction.EAST: return { x: pos.x + 1, y: pos.y }
    case Direction.SOUTH: return { x: pos.x, y: pos.y + 1 }
    case Direction.WEST: return { x: pos.x - 1, y: pos.y }
  }
}

function key(pos: Position) {
  return `${pos.y}:${pos.x}`
}

function run(map: string[][], start: Position) {
  let curr = { ...start }
  const visited = new Map<string, Direction[]>()
  while (!outside(map, curr)) {
    const seen = visited.get(key(curr)) ?? []

    if (seen.includes(curr.dir)) {
      throw new Error("LOOP")
    }

    seen.push(curr.dir)
    visited.set(key(curr), seen)
    const front = next(curr)

    if (map[front.y]?.[front.x] === "#") {
      curr.dir = (curr.dir + 1) % 4;
    } else {
      curr = { ...front, dir: curr.dir }
    }
  }

  return visited
}

function change(map: string[][], obs: Point) {
  const changed = []
  for (let y = 0; y < map.length; y++) {
    changed.push([])
    for (let x = 0; x < map[0].length; x++) {
      if (obs.x === x && obs.y === y) {
        changed[y][x] = "#"
      } else {
        changed[y][x] = map[y][x]
      }
    }
  }

  return changed
}

function loop(map: string[][], start: Position, visited: Map<string, Direction[]>) {
  let loops = 0
  for (const key of visited.keys()) {
    const [y, x] = key.split(":").map(Number)
    const changed = change(map, { x, y})

    try {
      run(changed, start)
    } catch (_) {
      loops += 1
    }
  }

  return loops
}

export function day6b(data: string[]) {
  const map = data.map(line => line.split(""))

  const start = findGuard(map)

  const visited = run(map, start)

  const loops = loop(map, start, visited)

  return loops;
}
