import { create_matrix } from '../utils/math';

function find_loops(edges: Map<string, Set<string>>, start: string) {
  const loops: string[] = []

  const queue: [string, string[], Set<string>][] = [[start, [], new Set()]]

  while (queue.length) {
    const [current, loop, seen] = queue.shift()

    if (loop.length > 1 && loops.find(l => l.startsWith(loop.toSorted((a, b) => a.localeCompare(b)).join(',')))) {
      continue
    } else if (loop.length === 3 && current === start) {
      loops.push(loop.toSorted((a, b) => a.localeCompare(b)).join(','))
      continue
    } else if (loop.length > 3) {
      continue
    }

    if (seen.has(current)) {
      continue
    }

    seen.add(current)

    loop.push(current)


    for (const edge of edges.get(current)) {
      queue.push([edge, [...loop], new Set(seen)])
    }
  }

  return loops
}

function parse(data: string[]): [Map<string, Set<string>>, string[], number[][]] {
  const edges = data.map(line => line.split('-'))
  const vertices = [...new Set(edges.flat()).values()].toSorted((a, b) => a.localeCompare(b))

  const matrix = create_matrix(vertices.length)

  for (const [from, to] of edges) {
    const i = vertices.indexOf(from)
    const j = vertices.indexOf(to)

    matrix[i][j] = 1
    matrix[j][i] = 1
  }

  return [
    edges.reduce((map, [from, to]) => {
      for (const [a, b] of [[from, to], [to, from]]) {
        const set = map.get(a) ?? new Set()
        set.add(b)
        map.set(a, set)
      }
      return map
    },new Map<string, Set<string>>()),
    vertices,
    matrix
  ]
}

export function day23a(data: string[]) {
  const [edges, vertices] = parse(data)

  const keys = vertices.filter((([key]) => key.includes("t")))

  const set = new Set()
  for (const edge of keys) {
    const loops = find_loops(edges, edge)
    for (const loop of loops) {
      set.add(loop)
    }
  }

  return set.size;
}
