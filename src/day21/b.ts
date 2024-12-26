import memoize from 'memoizee';
import { create_directional_keypad, create_numeric_keypad } from './shared';

function type(input: string, map: Record<string, Record<string, string>>) {
  let steps = ''

  let from = "A"
  for (let i = 0; i < input.length; i++) {
    const to = input[i]
    steps = steps + map[from][to]
    from = to
  }

  return steps
}

export function day21b(data: string[]) {
  const numeric_keypad = create_numeric_keypad()
  const directional_keypad = create_directional_keypad()

  const dfs = memoize((from: string, to: string, depth: number): bigint => {
    if (depth === 0) {
      return BigInt(directional_keypad[from][to].length)
    }

    const path = directional_keypad[from][to]

    let count = 0n
    let prev = "A"
    for (const next of path.split('')) {
      count += dfs(prev, next, depth - 1)
      prev = next
    }

    return count
  })

  return data.reduce((complexity, code) => {
    const numeric_input = type(code, numeric_keypad)
    const [count] = numeric_input.split('').reduce(([sum, prev], curr) => {
      return [sum + dfs(prev, curr, 24), curr]
    }, [0n, 'A'])

    return complexity + count * BigInt(code.slice(0, -1))
  }, 0n)

}
