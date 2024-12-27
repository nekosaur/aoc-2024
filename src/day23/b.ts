function parse(data: string[]): [Map<string, Set<string>>, Set<string>] {
  const connections = data.map(line => line.split("-"))

  const edges = new Map<string, Set<string>>()
  const vertices = new Set<string>()

  for (const [from, to] of connections) {
    for (const [a, b] of [[from, to], [to, from]]) {
      const set = edges.get(a) ?? new Set<string>()
      set.add(b)
      edges.set(a, set)
      vertices.add(a)
    }
  }

  return [edges, vertices]
}

// https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
function solve(vertices: Set<string>, edges: Map<string, Set<string>>) {
  const cliques: Set<string>[] = []
  function bron_kerboch(R: Set<string>, P: Set<string>, X: Set<string>) {
    if (!P.size && !X.size) {
      cliques.push(R)
    }

    for (const v of P) {
      const N = edges.get(v)
      bron_kerboch(R.union(new Set([v])), P.intersection(N), X.intersection(N))
      P.delete(v)
      X.add(v)
    }
  }

  bron_kerboch(new Set(), vertices, new Set())

  return cliques
}

export function day23b(data: string[]) {
  const [edges, vertices] = parse(data);

  const cliques = solve(vertices, edges)

  const biggest = cliques.toSorted((a, b) => b.size - a.size).at(0)

  return biggest.values().toArray().toSorted((a, b) => a.localeCompare(b)).join(',')
}
