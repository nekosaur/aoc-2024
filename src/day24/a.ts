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

function parse(data: string[]): [Record<string, number>, Record<string, Connection>, string[]] {
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

    connections[out] = [a, gate === 'AND' ? AND : gate === 'OR' ? OR : XOR, b]

    if (out.includes('z'))  {
      outputs.push(out)
    }

    line = data.shift()
  }

  return [registers, connections, outputs.toSorted((a, b) => a.localeCompare(b))]
}

function solve(registers: Record<string, number>, connections: Record<string, Connection>, output: string) {
  if (registers[output] != null) {
    return registers[output]
  }

  const [left, gate, right] = connections[output]

  const left_value = solve(registers, connections, left)
  const rigth_value = solve(registers, connections, right)

  registers[output] = gate(left_value, rigth_value)

  return registers[output]
}

export function day24a(data: string[]) {
  const [registers, connections, outputs] = parse(data)

  for (const output of outputs) {
    solve(registers, connections, output)
  }

  const value = parseInt(outputs.reduce((curr, item) => [registers[item], ...curr], []).join(''), 2)

  return value;
}
