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

function get(map: string[][], point: Point) {
  return map[point.y]?.[point.x] ?? "";
}

function check(map: string[][], start: Point) {
  const left = [get(map, travel(start, Direction.NORTH_WEST)), get(map, start), get(map, travel(start, Direction.SOUTH_EAST))].join("");
  const right = [get(map, travel(start, Direction.SOUTH_WEST)), get(map, start), get(map, travel(start, Direction.NORTH_EAST))].join("");

  return ["MAS", "SAM"].includes(left) && ["MAS", "SAM"].includes(right)
}

export function day4b(data: string[]) {
  const map = data.map(line => line.split(""))

  // console.log(map)

  let count = 0
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map.length; x++) {
      if (check(map, { x, y })) {
        count = count + 1
      }
    }
  }

  return count;
}
