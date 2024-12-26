import { Grid } from './grid';
import { from_key, key, move, Point } from './point';
import Heap from "heap"

enum Status {
  OPEN,
  CLOSED
}

function find_neighbours(map: Grid<string>, current: Point) {
  const neighbours = []

  neighbours.push({ x: 0, y: 1 }, { x: 0, y: -1 })
  neighbours.push({ x: 1, y: 0 }, { x: -1, y: 0 })

  return neighbours.map(neighbour => move(current, neighbour)).filter(n => {
    return n.y >= 0 && n.y < map.length && n.x >= 0 && n.x < map[0].length &&  map[n.y]?.[n.x] !== '#'
  })
}

function heuristic(a: Point, b: Point) {
  const [dx, dy] = [Math.abs(a.x - b.x), Math.abs(a.y - b.y)]
  return Math.max(dx, dy) + (Math.sqrt(2) - 1) * Math.min(dx, dy)
}

function real_cost(a: Point, b: Point) {
  return 1
}

function resolve_path(parents: Point[], current: Point) {
  const path = []

  while (current) {
    path.push(current)
    current = parents[key(current)]
  }

  path.reverse()

  return path
}

export function a_star(map: Grid<string>, start: Point, goal: Point, ) {
  const f_costs: number[] = []
  const g_costs: number[] = []
  const status = {}
  const parents = []

  const open_list = new Heap<string>((a, b) => {
    const diff = f_costs[a] - f_costs[b]
    return diff === 0 ? g_costs[a] - g_costs[b] : diff
  })

  const start_key = key(start)
  const goal_key = key(goal)

  g_costs[start_key] = 0
  f_costs[start_key] = heuristic(start, goal)
  status[start_key] = Status.OPEN
  parents[start_key] = null

  open_list.push(key(start))

  while (!open_list.empty()) {
    const current = open_list.pop()

    if (current === goal_key) {
      return [g_costs[current], resolve_path(parents, goal)]
    }

    status[current] = Status.CLOSED

    const neighbours = find_neighbours(map, from_key(current))

    for (const neighbour of neighbours) {
      const neighbour_key = key(neighbour)

      if (status[neighbour_key] === Status.CLOSED) {
        continue
      }

      const g_cost = g_costs[current] + real_cost(from_key(current), neighbour)
      const old_cost = neighbour_key in g_costs ? g_costs[neighbour_key] : Infinity
      const in_open_list = status[current] === Status.OPEN

      if (g_cost < old_cost) {
        g_costs[neighbour_key] = g_cost
        f_costs[neighbour_key] = g_cost + heuristic(neighbour, goal)
        parents[neighbour_key] = current

        if (!in_open_list) {
          status[neighbour_key] = Status.OPEN
          open_list.push(neighbour_key)
        } else {
          open_list.updateItem(neighbour_key)
        }
      }

    }
  }
}
