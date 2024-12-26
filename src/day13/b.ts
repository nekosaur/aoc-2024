import { Point } from '../utils/point';

type Machine = {
  a: Point
  b: Point
  prize: Point
}

function parse(data: string[]) {
  const machines: Machine[] = []

  while (data.length) {
    const a = [...data.shift().matchAll(/(\d+)/g)].map(([match]) => Number(match))
    const b = [...data.shift().matchAll(/(\d+)/g)].map(([match]) => Number(match))
    const prize = [...data.shift().matchAll(/(\d+)/g)].map(([match]) => Number(match))
    data.shift()
    machines.push({ a: { x: a[0], y: a[1] }, b: { x: b[0], y: b[1] }, prize: { x: prize[0], y: prize[1] } })
  }

  return machines
}

function check(a: number, b: number) {
  if (a % Math.floor(a) > 0 || b % Math.floor(b)) {
    return false
  }

  return true
}

export function day13b(data: string[]) {
  const machines = parse(data);

  let total = 0
  for (const machine of machines) {
    const first = [machine.a.x, machine.b.x, machine.prize.x + 10000000000000]
    const second = [machine.a.y, machine.b.y, machine.prize.y + 10000000000000]

    const first_remove_b = first.map(v => v * second[1])
    const second_remove_b = second.map(v => v * -first[1])

    const solve_a_left = first_remove_b[0] + second_remove_b[0]
    const solve_a_right = first_remove_b[2] + second_remove_b[2]

    const a = solve_a_right / solve_a_left
    const b = (first[2] - (first[0] * a)) / first[1]

    if (check(a, b)) {
      total += (a * 3) + b
    }
  }

  return total
}
