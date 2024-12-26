import { Point } from "../utils/point"

type Trail = {
  start: Point
  current: Point
}

type Map = number[][]

function findTrailheads(map: Map): Trail[] {
  const trailheads = []
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 0) {
        trailheads.push({ start: { x, y }, current: { x, y } })
      }
    }
  }
  return trailheads
}

function getHeight(map: Map, point: Point) {
  return map[point.y]?.[point.x]
}

function move(a: Point, b: Point) {
  return { x: a.x + b.x, y: a.y + b.y }
}

function findNextSteps(map: Map, point: Point, height: number) {
  const steps = [
    move(point, { x: 0, y: -1 }),
    move(point, { x: 1, y: 0 }),
    move(point, { x: 0, y: 1 }),
    move(point, { x: -1,y: 0 }),
  ]

  return steps.filter(step => getHeight(map, step) === height + 1)
}

function key(trail: Trail) {
  return `s[${trail.start.x}:${trail.start.y}]:c[${trail.current.y}:${trail.current.x}]`
}

function findTrails(map: Map, trailheads: Trail[]) {
  const queue = [...trailheads]
  const finished = []

  while (queue.length) {
    const trail = queue.shift()

    const height = getHeight(map, trail.current)

    if (height === 9) {
      finished.push(key(trail))
      continue
    }

    const nextSteps = findNextSteps(map, trail.current, height)

    for (const step of nextSteps) {
      queue.push({ ...trail, current: step })
    }
  }

  return finished
}

export function day10b(data: string[]) {
  const map = data.map(line => line.split("").map(Number))

  const trailheads = findTrailheads(map)

  const trails = findTrails(map, trailheads)

  return trails.length;
}
