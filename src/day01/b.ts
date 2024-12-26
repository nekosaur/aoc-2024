export function day1b(data: string[]) {
  const [left, right] = data.reduce<[number[], number[]]>((curr, line) => {
    const [left, right] = curr
    const pair = line.replaceAll(/\s+/g, " ").split(' ').map(v => parseInt(v, 10))
    return [[...left, pair[0]], [...right, pair[1]]]
  }, [[], []])

  const counts = ((arr) => {
    const map = new Map()

    for (const value of arr) {
      const curr = map.get(value) ?? 0

      map.set(value, curr + 1)
    }

    return map
  })(right)

  let similarity = 0

  for (const value of left) {
    similarity = similarity + (value * (counts.get(value) ?? 0))
  }

  return similarity
}
