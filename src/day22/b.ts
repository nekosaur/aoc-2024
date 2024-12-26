function mix_and_prune(a: bigint, b: bigint) {
  return (a ^ b) % 16777216n
}

function* password_generator(initial: bigint) {
  let current = initial
  while (true) {
    const old = current
    current = mix_and_prune(current, current * 64n)
    current = mix_and_prune(current, current / 32n)
    current = mix_and_prune(current, current * 2048n)
    yield [old, current]
  }
}

function max<T>(arr: IteratorObject<T>, callback: (item: T) => bigint) {
  let max = 0n
  let max_item = null
  for (const item of arr) {
    const v = callback(item)

    if (v > max) {
      max = v
      max_item = item
    }
  }

  return max_item
}

export function day22b(data: string[]) {
  const initial = data.map(BigInt)

  const result = initial.map(value => {
    const it = password_generator(value)

    const map = new Map<string, bigint>()
    const seq = []

    for (const [old, next] of it.take(2000)) {
      const old_digit = (old ?? value) % 10n
      const next_digit = next % 10n
      const diff = next_digit - old_digit

      if (seq.length >= 4) {
        seq.shift()
      }
      seq.push(diff)

      const key = seq.join(',')

      if (seq.length === 4 && !map.has(key)) {
        map.set(key, next_digit)
      }
    }

    return map
  })

  const keys = result.reduce((curr, item) => new Set([...curr, ...item.keys()]), new Set<string>())

  const sums = keys.keys().map(key => {
    const bananas = result.reduce((curr, item) => curr + (item.get(key) ?? 0n), 0n)
    return [key, bananas] as const
  })

  const found = max(sums, ([, sum]) => sum)

  return found[1]
}
