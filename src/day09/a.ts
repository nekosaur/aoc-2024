function createRange(value: unknown, length: number) {
  return [...Array(length).keys()].map(() => value)
}

function parse(data: number[]) {
  let arr = []
  let id = 0

  for (let i = 0; i < data.length; i += 2) {
    const fileBlocks = data[i];
    const freeSpace = data[i + 1];

    arr = arr.concat(createRange(id, fileBlocks)).concat(createRange(null, freeSpace))
    id += 1
  }

  return arr
}

function nextEmpty(map: (number | null)[], curr: number) {
  while (map[curr] != null) {
    curr += 1;
  }
  return curr;
}

function move(map: (number | null)[]) {
  let e = 0;

  for (let i = map.length - 1; i > 0; i--) {
    if (map[i] != null) {
      e = nextEmpty(map, e);
      if (e > i) break;
      map[e] = map[i]
      map[i] = null
    }
  }

  return map
}

function calc(map: (number | null)[]) {
  let checksum = 0

  for (let i = 0; i < map.length; i++) {
    if (map[i] != null) {
      checksum = checksum + (i * map[i])
    }
  }
  return checksum
}

export function day9a(data: string[]) {
  const diskMap = parse(data[0].split("").map(Number))
  const moved = move(diskMap)
  const checksum = calc(moved)
  return checksum;
}
