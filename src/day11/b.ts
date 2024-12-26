import memoize from "memoizee"

// log10(x) gives you the y in equation 10 ** y = x
// so for example log10(6439) = ~3.808
// by adding 1 and flooring we get the number of digits in any number
function digits(value: number) {
  return Math.floor(Math.log10(value) + 1)
}

const blink = memoize((stone: number) => {
  if (stone === 0) {
    return [1, null]
  }

  const d = digits(stone)

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
