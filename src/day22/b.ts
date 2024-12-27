function mix_and_prune(a: bigint, b: bigint) {
  return (a ^ b) % 16777216n
}

function* password_generator(initial: bigint) {
  let current = initial
  while (true) {
    const old = current
    current = mix_and_prune(current, current << 6n)
    current = mix_and_prune(current, current >> 5n)
    current = mix_and_prune(current, current << 11n)
    yield [old, current]
  }
}

export function day22b(data: string[]) {
  const initial = data.map(BigInt)

  const map = new Map<string, bigint>()

  initial.forEach(value => {
    const it = password_generator(value)

    const seen = new Set<string>()
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

      if (seq.length === 4 && !seen.has(key)) {
        map.set(key, (map.get(key) ?? 0n) + next_digit)
        seen.add(key)
      }
    }
  })

  let max = 0n
  for (const bananas of map.values()) {
    if (bananas > max) {
      max = bananas
    }
  }

  return max
}
