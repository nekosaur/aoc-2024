import { DIRECTIONS } from "../utils/direction"
import { Point } from "../utils/point"

type Region = {
  plant: string
  plots: Point[]
  queue: Point[]
}

type Garden = string[][]

function key(point: Point) {
  return `${point.y}:${point.x}`
}

function move(a: Point, b: Point) {
  return { x: a.x + b.x, y: a.y + b.y }
}

function findNeighbours(garden: Garden, point: Point, plant: string) {
  return DIRECTIONS.map(dir => move(point, dir)).filter(p => garden[p.y]?.[p.x] === plant)
}

function findRegions(garden: Garden) {
  const seen = new Set()

  const regions: Region[] = []

  for (let y = 0; y < garden.length; y++) {
    for (let x = 0; x < garden[0].length; x++) {
      const start = { x, y }

      if (seen.has(key(start))) {
        continue
      }

      const region = { plant: garden[y][x], plots: [], queue: [start] }
  
      while (region.queue.length) {
        const plot = region.queue.shift()

        if (seen.has(key(plot))) {
          continue
        }
  
        seen.add(key(plot))

        region.plots.push(plot)
  
        const neighbours = findNeighbours(garden, plot, region.plant)
        
        for (const neighbour of neighbours) {
          region.queue.push(neighbour)
        }
      }

      regions.push(region)
    }
  }

  return regions
}

function isNeighbour(a: Point, b: Point) {
  if (b == null) return false

  return DIRECTIONS.some(d => key(move(b, d)) === key(a))
}

function horizontal(a: Point, b: Point) {
  const d = a.x - b.x

  if (d === 0) return a.y - b.y

  return d
}

function vertical(a: Point, b: Point) {
  const d = a.y - b.y

  if (d === 0) return a.x - b.x

  return d
}

function raycast(map: Garden, plots: Point[], ray: Point, plant: string) {
  if (plots.length === 1) return 1

  // We need to sort plots differently depending on if it's a
  // horizontal or vertical ray, to make sure we can check neighbours correctly
  plots.sort(ray.y !== 0 ? vertical : horizontal)

  let sides = 0
  let prev = null
  for (const plot of plots) {
    const side = move(plot, ray)

    if (map[side.y]?.[side.x] !== plant) {
      if (!isNeighbour(plot, prev)) {
        sides += 1
      }

      prev = plot
    }
  }

  return sides
}

function calculate(garden: Garden, regions: Region[]) {
  return regions.reduce((curr, region) => {
    const sides = DIRECTIONS.reduce((curr, direction) => curr + raycast(garden, region.plots, direction, region.plant), 0)
    return curr + (region.plots.length * sides)
  }, 0)
}

export function day12b(data: string[]) {
  const garden = data.map(line => line.split(""))
  const regions = findRegions(garden)
  const sides = calculate(garden, regions)

  return sides;
}
