import { to_str } from '../utils/direction';
import { find_grid, Grid, grid, identity } from '../utils/grid';
import { key, move, Point } from '../utils/point';
import Heap from "heap"

function matrix_key(a: string, b: string) {
  return `${a} ${b}`
}

type Matrix = {
  data: Map<string, number>
  get: (a: string, b: string) => number
  set: (a: string, b: string, value: number) => void
}

function create_2d_matrix(): Matrix {
  const matrix = new Map<string, number>()

  return {
    data: matrix,
    get: (a: string, b: string) => {
      return matrix.get(matrix_key(a, b)) ?? Infinity
    },
    set: (a: string, b: string, value: number) => {
      matrix.set(matrix_key(a, b), value)
    }
  }
}

function parse_id(str: string) {
  const [pos, dir] = str.split("|")
  const [x, y] = pos.split(":").map(Number)

  return { x, y, dir, pos }
}

function is_wall(map: Grid<string>, position: Point) {
  return map[position.y][position.x] === '#'
}

function turn_left(direction: Point) {
  if (direction.x > 0) {
    return { x: 0, y: -1 }
  } else if (direction.x < 0) {
    return { x: 0, y: 1 }
  } else if (direction.y < 0) {
    return { x: -1, y: 0 }
  } else {
    return { x: 1, y: 0 }
  }
}

function turn_right(direction: Point) {
  if (direction.x > 0) {
    return { x: 0, y: 1 }
  } else if (direction.x < 0) {
    return { x: 0, y: -1 }
  } else if (direction.y < 0) {
    return { x: 1, y: 0 }
  } else {
    return { x: -1, y: 0 }
  }
}

function id(p: Point, d: Point) {
  return `${key(p)}|${to_str(d)}`
}

type Edges = {
  get: (p: string) => string[]
  add: (a: string, b: string) => void
  data: Map<string, Set<string>>
}

function create_edge_map(): Edges {
  const edges = new Map<string, Set<string>>()

  return {
    data: edges,
    get: (p: string) => {
      const list = edges.get(p)

      return list ? [...list.values()] : []
    },
    add: (a: string, b: string) => {
      const list = edges.get(a) ?? new Set()
      list.add(b)
      edges.set(a, list)
    }
  }
}

function find_adjacent_edges(map: Grid<string>, position: Point, direction: Point) {
  const forward = move(position, direction)

  const steps = []

  if (!is_wall(map, forward)) {
    steps.push([forward, 1, direction])
  }

  const left = turn_left(direction)
  if (!is_wall(map, move(position, left))) {
    steps.push([position, 1000, left])
  }

  const right = turn_right(direction)
  if (!is_wall(map, move(position, right))) {
    steps.push([position, 1000, right])
  }

  return steps
}

function create_adjacency_matrix(map: Grid<string>, start: { pos: Point, dir: Point }) {
  const queue = [start]

  const edges = create_edge_map()
  const matrix = create_2d_matrix()
  const vertices = new Set()

  while (queue.length) {
    const { pos, dir } = queue.shift()

    vertices.add(pos)

    for (const [n, cost, d] of find_adjacent_edges(map, pos, dir)) {
      if (cost < matrix.get(id(pos, dir), id(n, d))) {
        matrix.set(id(pos, dir), id(n, d), cost)
        edges.add(id(pos, dir), id(n, d))
        queue.push({ pos: n, dir: d })
      }

    }
  }

  return { matrix, edges, vertices: [...vertices.values()] }
}

function dijkstra(edges: Edges, matrix: Matrix, start_pos: Point, start_dir: Point, goal_pos: Point) {
  const distances = new Map<string, number>()
  const seen = new Map<string, Map<string, number>>()
  const queue = new Heap<{ id: string; distance: number }>((a, b) => a.distance - b.distance)

  const start_id = id(start_pos, start_dir)
  const goal_key = key(goal_pos)

  distances.set(start_id, 0)
  seen.set(start_id, new Map([[start_id, 1]]))

  queue.push({ id: start_id, distance: 0 })

  let least = Infinity

  while (!queue.empty()) {
    const { id, distance } = queue.pop()

    if (distance > least || distance > (distances.get(id) ?? Infinity)) {
      continue
    }

    const { pos } = parse_id(id)

    if (pos === goal_key) {
      if (distance < least) {
        least = distance
      }
    }

    const neighbours = edges.get(id).map(npos => [npos, matrix.get(id, npos)] as const)

    for (const [npos, ncost] of neighbours) {
      const new_distance = (distances.get(id) ?? 0) + ncost
      if (seen.get(id)?.get(npos) > 2) {
        continue
      }

      if (new_distance < (distances.get(npos) ?? Infinity)) {
        distances.set(npos, new_distance)

        const existing_seen = seen.get(id)
        const new_seen = new Map(existing_seen)
        new_seen.set(npos, (new_seen.get(npos) ?? 0) + 1)
        seen.set(npos, new_seen)

        queue.push({ id: npos, distance: new_distance })
      } else if (new_distance === distances.get(npos)) {
        const existing_seen = seen.get(npos)
        seen.set(npos, new Map([...existing_seen, ...seen.get(id)]))
      }
    }
  }

  return { distances, seen }
}

export function day16b(data: string[]) {
  const map = grid(data, identity)

  const start = find_grid(map, (x, y, c) => c === 'S')
  const goal = find_grid(map, (x, y, c) => c === 'E')

  const { edges, matrix } = create_adjacency_matrix(map, { pos: start, dir: { x: 1, y: 0 }})

  const result = dijkstra(edges, matrix, start, { x: 1, y: 0 }, goal)

  const seen_shortest_path = ['^', '<', 'v', '>'].reduce<Map<string, number>>((curr, dir) => {
    return result.seen.get(`${key(goal)}|${dir}`) ?? curr
  }, null)

  const unique_positions = new Set([...seen_shortest_path.keys()].map(id => parse_id(id).pos))

  return unique_positions.size
}
