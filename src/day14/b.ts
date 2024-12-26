import { key, move, p, Point } from '../utils/point';

type Robot = {
  pos: Point
  vel: Point
}

function parse(data: string[]) {
  return data.map(line => {
    const [px, py, vx, vy] = [...line.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/)].slice(1).map(Number)
    return { pos: p(px, py), vel: p(vx, vy) }
  })
}

function step(robot: Robot, width: number, height: number) {
  robot.pos = move(robot.pos, robot.vel)

  robot.pos.x = robot.pos.x < 0 ? width + robot.pos.x : robot.pos.x % width
  robot.pos.y = robot.pos.y < 0 ? height + robot.pos.y : robot.pos.y % height
}

function print(robots: Robot[], width: number, height: number) {
  const counts = new Map()
  for (const robot of robots) {
    const k = key(robot.pos)
    const c = counts.get(k) ?? 0
    counts.set(k, c + 1)
  }

  for (let y = 0; y < height; y++) {
    let row = ""
    for (let x = 0; x < width; x++) {
      const c = counts.get(key(p(x, y)))

      row += c ? c : '.'
    }
    console.log(row)
  }
}

function overlap(robots: Robot[]) {
  const seen = new Set()
  for (const robot of robots) {
    if (seen.has(key(robot.pos))) {
      return true
    }
    seen.add(key(robot.pos))
  }
  return false
}

function step_all(robots: Robot[], width: number, height: number) {
  robots.forEach(robot => step(robot, width, height))
}

export function day14b(data: string[]) {
  const width = 101
  const height = 103
  const robots = parse(data)

  let seconds = 1
  step_all(robots, width, height)

  while (overlap(robots)) {
    seconds += 1
    step_all(robots, width, height)
  }

  print(robots, width, height)

  return seconds
}
