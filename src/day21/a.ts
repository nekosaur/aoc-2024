import { create_directional_keypad, create_numeric_keypad } from './shared';

function type(input: string, map: Record<string, Record<string, string>>) {
  let steps = ''

  let from = "A"
  for (const to of input) {
    steps += map[from][to]
    from = to
  }

  return steps
}

export function day21a(data: string[]) {
  const numeric_keypad = create_numeric_keypad()
  const directional_keypad = create_directional_keypad()

  let complexity = 0
  for (const code of data) {
    let steps = type(code, numeric_keypad)

    steps = type(steps, directional_keypad)
    steps = type(steps, directional_keypad)

    complexity += steps.length * Number(code.slice(0, -1))
  }

  return complexity;
}
