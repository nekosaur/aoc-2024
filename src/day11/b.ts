import memoize from "memoizee"
import { num_digits } from "../utils/math"

const blink = memoize((stone: number) => {
  if (stone === 0) {
    return [1, null]
  }

  const d = num_digits(stone)

  if (d % 2 === 0) {
    const mid = Math.floor(d / 2)

    const tens = 10 ** mid

    // left and right parts is just integer division and modulo
    // respectively, using 10 ** midpoint
    return [Math.floor(stone / tens), stone % tens]
  }

  return [stone * 2024, null]
})

const count = memoize((stone: number | null, blinks: number) => {
  if (stone == null) return 0

  const [left, right] = blink(stone)

  if (blinks === 1) {
    return right != null ? 2 : 1
  }

  return count(left, blinks - 1) + count(right, blinks - 1)
})

export function day11b(data: string[]) {
  const stones = data[0].split(" ").map(Number)

  let total = 0
  for (const stone of stones) {
    total += count(stone, 75)
  }

  return total
}
