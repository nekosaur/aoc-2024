function parse(data: string[]): [string[], string[]] {
  const patterns = data.shift().split(", ").toSorted((a, b) => b.length - a.length)

  data.shift()

  const towels = data

  return [patterns, towels]
}

export function match(towel: string, patterns: string[]) {
  const map = patternMap(patterns)
  const seen = new Set()
  const queue = [
    towel
  ]

  while (queue.length) {
    const rest = queue.shift()

    if (seen.has(rest)) {
      continue
    }

    if (!rest) {
      return true
    }

    seen.add(rest)

    const p = map.get(rest[0])

    if (!p) { continue }

    const matches = p.filter(pattern => rest.startsWith(pattern))

    for (const match of matches) {
      queue.push(rest.slice(match.length))
    }
  }

  return false
}

function patternMap(patterns: string[]): Map<string, string[]> {
  const map = new Map<string, string[]>()

  const sortedPatterns = patterns.toSorted((a, b) => a.localeCompare(b))

  let first = sortedPatterns[0][0]
  let arr = []
  for (let i = 0; i < sortedPatterns.length; i++) {
    if (first !== sortedPatterns[i][0]) {
      map.set(first, arr)
      first = sortedPatterns[i][0]
      arr = []
    }

    arr.push(sortedPatterns[i])

    if (i === sortedPatterns.length - 1) {
      map.set(first, arr)
    }
  }

  return map
}

export function day19a(data: string[]) {
  const [patterns, towels] = parse(data)

  const valid = towels.filter(towel => match(towel, patterns))

  return valid.length;
}
