import { Grid, grid, identity } from '../utils/grid';
import { key, move, Point } from '../utils/point';

type Region = {
  plant: string
  area: number
  perimeter: number
  queue: Point[]
}

function findNeighbours(garden: Grid<string>, point: Point, plant: string) {
  const directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
  ]

  return directions.map(dir => move(point, dir)).filter(p => garden[p.y]?.[p.x] === plant)
}

function calculate(garden: Grid<string>) {
  const seen = new Set()

  const regions: Region[] = []

  for (let y = 0; y < garden.length; y++) {
    for (let x = 0; x < garden[0].length; x++) {
      const s = { x, y }

      if (seen.has(key(s))) {
        continue
      }

      const region = { plant: garden[y][x], area: 0, perimeter: 0, queue: [s] }

      while (region.queue.length) {
        const plot = region.queue.shift()

        if (seen.has(key(plot))) {
          continue
        }

        seen.add(key(plot))

        const neighbours = findNeighbours(garden, plot, region.plant)

        region.area += 1
        region.perimeter += 4 - neighbours.length

        for (const neighbour of neighbours) {
          region.queue.push(neighbour)
        }
      }

      regions.push(region)
    }
  }

  return regions.reduce((curr, region) => curr + (region.area * region.perimeter), 0)
}

export function day12a(data: string[]) {
  const garden = grid(data, identity)
  const total = calculate(garden)
  return total;
}
