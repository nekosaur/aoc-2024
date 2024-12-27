enum Direction {
  EAST,
  SOUTH_EAST,
  SOUTH,
  SOUTH_WEST,
  WEST,
  NORTH_WEST,
  NORTH,
  NORTH_EAST,
}

const DIRECTIONS = [
  Direction.EAST,
  Direction.SOUTH_EAST,
  Direction.SOUTH,
  Direction.SOUTH_WEST,
  Direction.WEST,
  Direction.NORTH_WEST,
  Direction.NORTH,
  Direction.NORTH_EAST,
]

type Point = {
  x: number
  y: number
}

function travel(point: Point, dir: Direction) {
  switch (dir) {
    case Direction.EAST: return { x: point.x + 1, y: point.y }
    case Direction.SOUTH_EAST: return { x: point.x + 1, y: point.y + 1 }
    case Direction.SOUTH: return { x: point.x, y: point.y + 1 }
    case Direction.SOUTH_WEST: return { x: point.x - 1, y: point.y + 1 }
    case Direction.WEST: return { x: point.x - 1, y: point.y }
    case Direction.NORTH_WEST: return { x: point.x - 1, y: point.y - 1}
    case Direction.NORTH: return { x: point.x, y: point.y - 1 }
    case Direction.NORTH_EAST: return { x: point.x + 1, y: point.y - 1 }
  }
}

const XMAS = "XMAS"

function get(map: string[][], point: Point) {
  return map[point.y]?.[point.x] ?? "";
}

function check(map: string[][], start: Point, dir: Direction) {
  let curr = {...start}
  for (let i = 0; i < XMAS.length; i++) {
    if (get(map, curr) !== XMAS[i]) {
      return false;
    }
    curr = travel(curr, dir)
  }

  return true;
}

export function day4a(data: string[]) {
  const map = data.map(line => line.split(""))

  let count = 0
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map.length; x++) {
      const found = DIRECTIONS.filter(dir => check(map, { x, y }, dir))

      count = count + found.length
    }
  }

  return count;
}
