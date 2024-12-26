import { match as match_a } from "./a"

function parse(data: string[]): [string[], string[]] {
  const patterns = data.shift().split(", ").toSorted((a, b) => b.length - a.length)

  data.shift()

  const towels = data

  return [patterns, towels]
}

function find_patterns(part: string, patterns: string[]) {
  return patterns.filter(pattern => part.startsWith(pattern)).map(pattern => ([pattern, part.slice(pattern.length)]))
}

function recursive(rest: string, i: number, patterns: string[], cache: Record<string, bigint>, len: number): bigint {
  if (cache[rest]) {
    return cache[rest]
  }

  if (!rest) {
    return 1n
  }

  const matches = find_patterns(rest, patterns)

  let count = 0n

  for (const [match, other] of matches) {
    count += recursive(other, i - match.length, patterns, cache, len)
  }

  if (count > 0) {
    cache[rest] = count
  }

  return count
}

function match(towel: string, patterns: string[]) {
  return recursive(towel, towel.length, patterns, {}, towel.length)
}

export function day19b(data: string[]) {
  const [patterns, towels] = parse(data)

  let count = 0n
  for (const towel of towels) {
    try {
      const exists = match_a(towel, patterns)
      if (!exists) {
        continue
      }
      count += match(towel, patterns)
    } catch (err) {
      console.error(err)
    }
  }

  return count
}
