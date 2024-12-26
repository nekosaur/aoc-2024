function mix_and_prune(a: bigint, b: bigint) {
  return (a ^ b) % 16777216n
}

function* password_generator(initial: bigint) {
  let current = initial
  while (true) {
    current = mix_and_prune(current, current * 64n)
    current = mix_and_prune(current, current / 32n)
    current = mix_and_prune(current, current * 2048n)
    yield current
  }
}

export function day22a(data: string[]) {
  const initial = data.map(BigInt)

  const result = initial.map(value => {
    const it = password_generator(value)

    return it.drop(2000 - 1).take(1).reduce((curr, item) => item, null)
  })

  return result.reduce((curr, value) => curr + value, 0n);
}
