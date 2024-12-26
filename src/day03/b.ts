function findNext(instruction: string, i: number): [null | string, null | string[], number] {
  const MUL =/^mul\((\d+),(\d+)\)/
  const DO =/^do\(\)/
  const DONT =/^don't\(\)/

  const sliced = instruction.slice(i)
  if (MUL.test(sliced)) {
    const matches = MUL.exec(sliced)
    return ["mul", matches, i + (matches ? matches[0].length : 0)]
  } else if (DO.test(sliced)) {
    return ["do", null, i + 4]
  } else if (DONT.test(sliced)) {
    return ["don't", null, i + 6]
  } else {
    return [null, null, i + 1]
  }
}

export function day3b(data: string[]) {
  const instruction = data.join('')

  let total = 0
  let enabled = true
  let i = 0

  while (i < instruction.length) {
    const [action, matches, next] = findNext(instruction, i)

    switch (action) {
      case "do": {
        enabled = true;
        break;
      }
      case "don't": {
        enabled = false;
        break;
      }
      case "mul": {
        if (enabled && matches) {
          total = total + (Number(matches[1])  * Number(matches[2]))
        }
      }
    }

    i = next
  }

  return total
}
