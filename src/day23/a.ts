import { create_matrix } from '../utils/math';

function find_loops(edges: Map<string, Set<string>>, start: string) {
  const loops: Set<string> = new Set()

  const queue: [string, string, Set<string>][] = [[start, start, new Set([start])]]

  while (queue.length) {
    const [start, current, triangle] = queue.shift()

    if (triangle.size > 3) {
      continue
    }

    for (const edge of edges.get(current)) {
      if (triangle.size === 3 && edge === start) {
        loops.add([...triangle.values()].toSorted((a, b) => a.localeCompare(b)).join(','))
      } else if (!triangle.has(edge)) {
        queue.push([start, edge, new Set([...triangle.values(), edge])])
      }
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
