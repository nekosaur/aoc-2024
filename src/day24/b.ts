type Gate = (a: number, b: number) => number

type Connection = [string, Gate, string]

function AND(a: number, b: number) {
  return a & b
}

function OR(a: number, b: number) {
  return a | b
}

function XOR(a: number, b: number) {
  return a ^ b
}

function parse(data: string[], switches: Map<string, string>): [Record<string, number>, Record<string, Connection>, string[]] {
  const registers: Record<string, number> = {}

  let line = data.shift()
  while (line) {
    const [, register, value] = line.match(/(\w\d+):\s(\d+)/)
    registers[register] = Number(value)
    line = data.shift()
  }

  const connections: Record<string, Connection> = {}
  const outputs: string[] = []

  line = data.shift()
  while (line) {
    const [, a, gate, b, out] = line.match(/([\w\d]+)\s(\w+)\s([\w\d]+)\s->\s([\w\d]+)/)

    const switched = switches.get(out) ?? out

    connections[switched] = [a, gate === 'AND' ? AND : gate === 'OR' ? OR : XOR, b]

    if (out.includes('z'))  {
      outputs.push(out)
    }

    line = data.shift()
  }

  return [registers, connections, outputs.toSorted((a, b) => a.localeCompare(b))]
}

const DEBUG = false

function solve(registers: Record<string, number>, connections: Record<string, Connection>, output: string, depth = 0) {
  function log(...rest: unknown[]) {
    if (!DEBUG) return
    const pad = Array(depth).fill('  ')
    console.log(pad.join(''), ...rest)
  }

  log("calculating output", output)

  if (registers[output] != null) {
    log("already has value", registers[output])
    return registers[output]
  }

  const [left, gate, right] = connections[output]

  log(left, gate, right)

  // This is only so that debug output is more consistent, not needed for solution
  const [sorted_left, sorted_right] = [left, right].toSorted((a, b) => {
    const fn_a = connections[a]?.[1]
    const fn_b = connections[b]?.[1]

    const va = fn_a == null ? -1 : fn_a === OR ? 0 : fn_a === AND ? 1 : 2
    const vb = fn_b == null ? -1 : fn_b === OR ? 0 : fn_b === AND ? 1 : 2

    return va - vb
  })

  const left_value = solve(registers, connections, sorted_left, depth + 1)
  const rigth_value = solve(registers, connections, sorted_right, depth + 1)

  registers[output] = gate(left_value, rigth_value)

  log("setting output", output, "to", registers[output])

  return registers[output]
}

function read(registers: Record<string, number>, char: string) {
  const bits = Object.keys(registers).filter(key => key.startsWith(char)).toSorted((a, b) => a.localeCompare(b))
  return bits.reduce((curr, bit) => [registers[bit], ...curr], []).join('')
}

export function day24b(data: string[]) {
  // Identified manually by debugging instructions
  // around failing single bit adds from z00-z44
  const switches = [
    ['shj', 'z07'],
    ['tpk', 'wkb'],
    ['pfn', 'z23'],
    ['kcd', 'z27']
  ]

  const switches_map = switches.reduce((curr, [a, b]) => {
    curr.set(a, b)
    curr.set(b, a)
    return curr
  }, new Map())

  const [registers, connections, outputs] = parse(data, switches_map)

  for (const output of outputs) {
    solve(registers, connections, output)
  }

  const x = BigInt("0b" + read(registers, "x"))
  const y = BigInt("0b" + read(registers, "y"))
  const z = BigInt("0b" + read(registers, "z"))

  if (x + y !== z) {
    throw new Error("wires crossed!")
  }

  return switches.flat().toSorted().join('');
}
