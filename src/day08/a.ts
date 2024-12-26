function pairs<T>(array: T[]) {
  const seen = new Set();
  const pairs = [];

  for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
          const key = [array[i], array[j]].sort().join("")

          if (!seen.has(key)) {
              seen.add(key);
              pairs.push([array[i], array[j]]);
          }
      }
  }

  return pairs;
}

type Point = {
  x: number
  y: number
}

function key(p: Point) {
  return `${p.y}:${p.x}`
}

function point(key: string) {
  const [y, x] = key.split(":").map(Number)
  return { x, y }
}

function findAntennas(map: string[][]) {
  const antennas = new Map<string, Set<string>>()

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const c = map[y][x]

      if (c !== '.') {
        const list = antennas.get(c) ?? new Set()
        list.add(key({ x, y}))
        antennas.set(c, list)
      }
    }
  }

  return new Map([...antennas.entries()].map(([antenna, list]) => [antenna, [...list.values()]]))
}

function distance(a: Point, b: Point) {
  return { x: a.x - b.x, y: a.y - b.y }
}

function move(p: Point, delta: Point) {
  return { x: p.x + delta.x, y: p.y + delta.y }
}

function inside(map: string[][], p: Point) {
  return p.x >= 0 && p.x < map[0].length && p.y >= 0 && p.y < map.length
}

export function day8a(data: string[]) {
  const map = data.map(line => line.split(""))
  const antennas = findAntennas(map)

  const unique = [...antennas.values()].reduce((set, list) => {
    const valid = pairs(list).map(arr => arr.map(key => point(key))).reduce((curr, [a, b]) => {
      const antinodes = [move(a, distance(a, b)), move(b, distance(b, a))].filter(p => inside(map, p)).map(p => key(p))

      return new Set([...curr.values(), ...antinodes])
    }, new Set())

    return new Set([...set.values(), ...valid.values()])
  }, new Set())

  return unique.size;
}
