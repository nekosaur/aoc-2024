import { run } from '../day17/a';

type Computer = {
  registers: [number, number, number],
  instructions: number[]
}

function computer(data: string[]): Computer {
  const lines = [...data]
  const a = Number(lines.shift().match(/(\d+)/)[1])
  const b = Number(lines.shift().match(/(\d+)/)[1])
  const c = Number(lines.shift().match(/(\d+)/)[1])

  lines.shift()

  const instructions = [...lines.shift().match(/(\d+)/g)].map(Number)

  return {
    registers: [a, b, c],
    instructions,
  }
}

function* index(current: bigint) {
  const base = current << BigInt(3)

  for (let i = BigInt(0); i < 8; i++) {
    yield base + i
  }
}

export function day17b(data: string[]) {
  const { instructions } = computer(data)

  const queue: [number, bigint][] = [
    [instructions.length - 1, BigInt(0)]
  ]

  while (queue.length) {
    const [i, v] = queue.shift()

    if (i < 0) {
      return v
    }

    for (const j of index(v)) {
      const calc = run({ registers: [j, BigInt(0), BigInt(0)], instructions })

      if (calc.join(',') === instructions.slice(i).join(',')) {
        queue.push([i - 1, j])
      }
    }
  }
}
