function pairs<T>(array: T[]) {
  const seen = new Set();
  const pairs: T[][] = [];

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

function antinodes(map: string[][], start: Point, delta: Point) {
  const antinodes = []
  let curr = { ...start }

  while (inside(map, curr)) {
    antinodes.push(curr)
    curr = move(curr, delta)
  }

  return antinodes
}

export function day8b(data: string[]) {
  const map = data.map(line => line.split(""))
  const antennas = findAntennas(map)

  const unique = new Set([...antennas.values()].reduce((curr, list) => {
    const valid = pairs(list)
      .map(arr => arr.map(key => point(key)))
      .reduce<string[]>((curr, [a, b]) => {
        const nodes = [...antinodes(map, a, distance(a, b)), ...antinodes(map, b, distance(b, a))].map(p => key(p))

        return [...curr, ...nodes]
      }, [])

    return [...curr, ...valid]
  }, []))

  return unique.size;
}
