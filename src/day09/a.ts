function findLastFile(diskMap: [number, number][], index: number) {
  while (diskMap[index][1] === 0) {
    index = index - 2
  }

  return index
}

function findFilesToMove(diskMap: [number, number][], freeSize: number, index: number, stopIndex: number): [[number, number][], number] {
  const moved = []
  let lastFileIndex = index
  while (freeSize > 0) {
    lastFileIndex = findLastFile(diskMap, lastFileIndex)
    if (lastFileIndex <= stopIndex) {
      return [moved, -1]
    }
    const [fileId, fileSize] = diskMap[lastFileIndex]

    // We can move the entire file
    if (freeSize >= fileSize) {
      moved.push([...diskMap[lastFileIndex]])
      diskMap[lastFileIndex][1] = 0

      freeSize = freeSize - fileSize
    // We can move a part of the file
    } else {
      moved.push([fileId, freeSize])
      diskMap[lastFileIndex][1] = fileSize - freeSize
      freeSize = 0
    }
  }

  return [moved, lastFileIndex]
}

function check(state: [number, number], file: [number, number]): [number, number] {
  const [id, size] = file
  let [i, sum] = state

  for (let j = 0; j < size; j++) {
    sum += (i + j) * id
  }

  i = i + size

  return [i, sum]
}

function move(diskMap: [number, number][]) {
  let lastFile = diskMap.length - 1
  let state: [number, number] = [0, 0]
  for (let i = 0; i < diskMap.length; i++) {
    const [id, size] = diskMap[i]

    // If it's a file we just move it to out
    if (id >= 0){
      if (size > 0) {
        state = check(state, diskMap[i])
      }
    // Otherwise it's free space and we need to move things around
    } else {
      const [moved, newLastFile] = findFilesToMove(diskMap, size, lastFile, i)
      for (const m of moved) {
        state = check(state, m)
      }
      if (newLastFile < 0) {
        return state[1]
      }
      lastFile = newLastFile
    }
  }

  return state[1]
}

export function day9a(data: string[]) {
  const diskMap = data[0].split("").map<[number, number]>((v, i) => [i % 2 == 0 ? i / 2 : -1, Number(v)])
  const checksum = move(diskMap)
  return checksum;
}
