import { dir, DIRECTIONS } from "../utils/direction"
import { key, move, p, Point } from "../utils/point"

export function create_map(keypad: (string | null)[][], priority: (a: string, from: Point, to: Point) => number) {
  function neighbours(p: Point) {
    return DIRECTIONS.map(d => move(p, d)).filter(np => {
      return typeof keypad[np.y]?.[np.x] === "string"
    })
  }

  function get(p: Point) {
    return keypad[p.y][p.x]
  }

  const keys = keypad.map((row, y) => {
    return row.map((key, x) => p(x, y))
  }, []).flat().filter(p => get(p) != null)

  const map: Record<string, Record<string, string>> = keys.reduce((curr, key) => {
    curr[get(key)] = {}
    return curr
  }, {})

  const queue: [Point, Point, string, Set<string>][] = keys.map(key => [key, key, '', new Set()])

  function compare(a: string, b: string, from: Point, to: Point) {
    const ascore = score(a)
    const bscore = score(b)

    if (ascore === bscore) {
      return priority(a, from, to) < priority(b, from, to) ? a : b
    }

    return ascore < bscore ? a : b
  }

  function score(path: string) {
    return [...path.matchAll(/>+|v+|\^+|<+/g)].length
  }

  while (queue.length) {
    const [start, point, path, seen] = queue.shift()

    const from = get(start)
    const to = get(point)

    if (map[from][to]) {
      const better = compare(map[from][to], path, start, point)
      map[from][to] = better
    } else {
      map[from][to] = from === to ? '' : path
    }

    if (seen.has(key(point))) {
      continue
    }

    seen.add(key(point))

    for (const n of neighbours(point)) {
      if (!seen.has(key(n))) {
        queue.push([start, n, path + dir(point, n), new Set(seen)])
      }
    }
  }

  Object.entries(map).forEach(([from, value]) => {
    Object.entries(value).forEach(([to, path]) => {
      map[from][to] = path + "A"
    })
  })

  return map
}


export function create_numeric_keypad() {
  function is_bottom(p: Point) {
    return p.y === 3
  }

  function is_left(p: Point) {
    return p.x === 0
  }

  function is_left_of(a: Point, b: Point) {
    return a.x < b.x
  }

  // This was a pain, I got stuck halfway trying to figure
  // out all the rules, had to get a hint from reddit :|
  function priority(path: string, from: Point, to: Point) {
    if (path.includes("<") && path.includes("^")) {
      if (is_bottom(from) && is_left_of(to, from)) {
        return path.indexOf("<") < path.indexOf("^") ? 1 : -1
      }
      return path.indexOf("<") < path.indexOf("^") ? -1 : 1
    }
    if (path.includes("v") && path.includes(">")) {
      if (is_left(from) && is_bottom(to)) {
        return path.indexOf("v") < path.indexOf(">") ? 1 : -1
      }
      return path.indexOf("v") < path.indexOf(">") ? -1 : 1
    }
    if (path.includes("^") && path.includes(">")) {
      return path.indexOf("^") < path.indexOf(">") ? -1 : 1
    }
    if (path.includes("<") && path.includes("v")) {
      return path.indexOf("<") < path.indexOf("v") ? -1 : 1
    }
  }

  return create_map([
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [null, "0", "A"]
  ], priority)
}

export function create_directional_keypad() {
  function priority(path: string) {
    if (path.includes("<") && path.includes("^")) {
      return path.indexOf("<") < path.indexOf("^") ? -1 : 1
    }
    if (path.includes("v") && path.includes(">")) {
      return path.indexOf("v") < path.indexOf(">") ? -1 : 1
    }
    if (path.includes("^") && path.includes(">")) {
      return path.indexOf("^") < path.indexOf(">") ? -1 : 1
    }
    if (path.includes("<") && path.includes("v")) {
      return path.indexOf("<") < path.indexOf("v") ? -1 : 1
    }
  }

  return create_map([
    [null, "^", "A"],
    ["<", "v", ">"]
  ], priority)
}
