import { find_grid, Grid, grid, identity } from '../utils/grid';
import { key, move, Point } from '../utils/point';
import Heap from "heap"

enum Status {
  OPEN,
  CLOSED
}

function find_neighbours(map: Grid<string>, current: Point, direction: Point) {
  const neighbours = [direction]

  if (direction.x !== 0) {
    neighbours.push({ x: 0, y: 1 }, { x: 0, y: -1 })
  } else {
    neighbours.push({ x: 1, y: 0 }, { x: -1, y: 0 })
  }

  return neighbours.map(neighbour => move(current, neighbour)).filter(neighbour => {
    return map[neighbour.y]?.[neighbour.x] !== '#'
  })
}

function heuristic(a: Point, b: Point) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function real_cost(a: Point, b: Point, direction: Point) {
  if (direction.x !== 0) {
    return a.y === b.y ? 1 : 1001
  } else {
    return a.x === b.x ? 1 : 1001
  }
}

function get_direction(a: Point, b: Point) {
  return { x: b.x - a.x, y: b.y - a.y }
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

export function a_star(map: Grid<string>, start: Point, goal: Point, direction: Point) {
  const f_costs: number[] = []
  const g_costs: number[] = []
  const status = []
  const parents = []
  const directions = []

  const open_list = new Heap<Point>((a, b) => {
    const diff = f_costs[key(a)].toFixed(6) - f_costs[key(b)].toFixed(6)
    return diff === 0 ? g_costs[key(b)].toFixed(6) - g_costs[key(a)].toFixed(6) : diff
  })

  const start_key = key(start)
  const goal_key = key(goal)

  g_costs[start_key] = 0
  f_costs[start_key] = heuristic(start, goal)
  status[start_key] = Status.OPEN
  parents[start_key] = null
  directions[start_key] = direction

  open_list.push(start)

  while (!open_list.empty()) {
    const current = open_list.pop()
    const current_key = key(current)

    if (current_key === goal_key) {
      return [g_costs[current_key], resolve_path(parents, goal)]
    }

    status[current_key] = Status.CLOSED

    const dir = directions[current_key]

    const neighbours = find_neighbours(map, current, dir)

    for (const neighbour of neighbours) {
      const neighbour_key = key(neighbour)

      if (status[neighbour_key] === Status.CLOSED) {
        continue
      }

      const g_cost = g_costs[current_key] + real_cost(current, neighbour, dir)
      const old_cost = neighbour_key in g_costs ? g_costs[neighbour_key] : Infinity
      const in_open_list = status[current_key] === Status.OPEN

      if (g_cost < old_cost) {
        g_costs[neighbour_key] = g_cost
        f_costs[neighbour_key] = g_cost + heuristic(neighbour, goal)
        parents[neighbour_key] = current
        directions[neighbour_key] = get_direction(current, neighbour)
      }

      if (!in_open_list) {
        status[neighbour_key] = Status.OPEN
        open_list.push(neighbour)
      } else {
        open_list.updateItem(neighbour)
      }
    }
  }
}

export function day16a(data: string[]) {
  const map = grid(data, identity)

  const start = find_grid(map, (x, y, c) => c === 'S')
  const goal = find_grid(map, (x, y, c) => c === 'E')

  const [cost, _] = a_star(map, start, goal, { x: 1, y: 0 })

  return cost;
}
