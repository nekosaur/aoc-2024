function solve(value: bigint, operands: bigint[]) {
  const queue: [bigint, bigint[], (string | bigint)[]][] = [
    [value, operands.slice(), []]
  ]

  while (queue.length) {
    const [left, ops, solution] = queue.pop()

    if (ops.length === 1 && left === ops[0]) {
      return true
    }

    if (!ops.length || left === 0n) continue

    const operand = ops.pop()

    if (left - operand >= 0n) {
      queue.push([left - operand, ops.slice(), ["+", operand, ...solution]])
    }

    if (left % operand === 0n) {
      queue.push([left / operand, ops.slice(), ["*", operand, ...solution]])
    }
  }

  return false
}

export function day7a(data: string[]) {
  const equations = data.map(line => {
    const [value, numbers] = line.split(": ")
    return { value: BigInt(value), numbers: numbers.split(" ").map(BigInt) }
  })

  const valid = equations.filter(({ value, numbers }) => {
    return solve(value, numbers)
  })

  return valid.reduce((curr, valid) => curr + valid.value, BigInt(0));
}
