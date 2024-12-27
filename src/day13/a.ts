import { Point } from '../utils/point';
import { solve } from './b';
// import memoize from "memoizee"

type Machine = {
  a: Point
  b: Point
  prize: Point
}

// const press = memoize((value: number, presses: number) => value * presses, { primitive: true })

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

// const solve = memoize((machine: Machine, a_presses: number, b_presses: number): [number, number] | null => {
//   const x = press(machine.a.x, a_presses) + press(machine.b.x, b_presses)
//   const y = press(machine.a.y, a_presses) + press(machine.b.y, b_presses)

//   if (x > machine.prize.x || y > machine.prize.y) {
//     return null
//   }

//   if (x === machine.prize.x && y === machine.prize.y) {
//     return [a_presses, b_presses]
//   }

//   if (a_presses >= 100 || b_presses >= 100) {
//     return null
//   }

//   const a = solve(machine, a_presses + 1, b_presses)
//   if (a) return a
//   const b = solve(machine, a_presses, b_presses + 1)
//   if (b) return b

//   return null
// })

export function day13a(data: string[]) {
  const machines = parse(data);
  // const tokens = machines.reduce((curr, machine) => {
  //   const presses = solve(machine, 0, 0)

  //   return curr + (presses ? presses[0] * 3 + presses[1] : 0)
  // }, 0)

  return solve(machines);
}
