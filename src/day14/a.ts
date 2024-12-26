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

function step_all(robots: Robot[], width: number, height: number) {
  robots.forEach(robot => step(robot, width, height))
}

function quadrants(robots: Robot[], width: number, height: number) {
  const nw = []
  const ne = []
  const sw = []
  const se = []

  const midx = Math.floor(width / 2)
  const midy = Math.floor(height / 2)

  for (const robot of robots) {
    const { x, y } = robot.pos

    if (x < midx && y < midy) {
      nw.push(robot)
    } else if (x > midx && y < midy) {
      ne.push(robot)
    } else if (x < midx && y > midy) {
      sw.push(robot)
    } else if (x > midx && y > midy) {
      se.push(robot)
    }
  }

  return [nw, ne, sw, se]
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

export function day14a(data: string[]) {
  const width = 101
  const height = 103
  const robots = parse(data)

  for (let i = 0; i < 100; i++) {
    step_all(robots, width, height)
  }

  print(robots, width, height)

  const q = quadrants(robots, width, height)

  return q.reduce((curr, quadrant) => curr * quadrant.length, 1);
}
