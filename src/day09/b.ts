type DiskItem = {
  type: "file",
  id: number
  size: number
  moved: boolean
} | {
  type: "free",
  size: number
}

function parse(data: number[]) {
  const arr: DiskItem[] = []
  let id = 0
  let start = 0

  for (let i = 0; i < data.length; i += 2) {
    const fileBlocks = data[i];
    const freeSpace = data[i + 1];

    arr.push({ type: "file", id, size: fileBlocks, moved: false })
    if (freeSpace > 0) {
      arr.push({ type: "free", size: freeSpace })
    }
    id += 1
    start = start + fileBlocks + freeSpace
  }

  return arr
}

function findFreeSpace(map: DiskItem[], size: number): [DiskItem | null, number] {
  let curr = 0
  while (curr < map.length) {
    const item = map[curr]
    if (item.type === "free" && item.size >= size) {
      return [item, curr]
    }
    curr += 1;
  }

  return [null, -1];
}

function move(map: DiskItem[]) {
  for (let i = map.length - 1; i > 0; i--) {
    const item = map[i]

    if (item.type === "file" && !item.moved) {
      const [empty, ei] = findFreeSpace(map, item.size)

      if (ei >= 0 && ei < i) {
        // replace old file blocks with free space
        map.splice(i, 1, { type: "free", size: item.size })
        // move file blocks to front of free space
        map.splice(ei, 0, item)
        item.moved = true

        // reduce size of free space
        empty.size = empty.size - item.size

        // this is not strictly necessary, but removes zero sized free spaces
        if (empty.size <= 0) {
          map.splice(ei + 1, 1)
        }

        i = i + 1
      }
    }
  }

  return map
}

function calc(map: DiskItem[]) {
  let checksum = 0
  let start = 0

  for (let i = 0; i < map.length; i++) {
    const item = map[i];
    if (item.type === "file") {
      for (let j = 0; j < item.size; j++) {
        checksum = checksum + ((start + j) * item.id)
      }
    }

    start += item.size
  }
  return checksum
}

export function day9b(data: string[]) {
  const diskMap = parse(data[0].split("").map(Number))
  const moved = move(diskMap)
  const checksum = calc(moved)
  return checksum;
}
