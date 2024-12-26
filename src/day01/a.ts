export function day1a(data: string[]) {
  const [left, right] = data.reduce<[number[], number[]]>((curr, line) => {
    const [left, right] = curr
    const pair = line.replaceAll(/\s+/g, " ").split(' ').map(v => parseInt(v, 10))
    return [[...left, pair[0]], [...right, pair[1]]]
  }, [[], []])

  left.sort()
  right.sort()

  let distance = 0

  for (let i = 0; i < left.length; i++) {
    distance = distance + Math.abs(right[i] - left[i])
  }

  return distance
}
