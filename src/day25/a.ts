function parse(data: string[]) {
  const locks = []
  const keys = []

  while (data.length) {
    let line = data.shift()

    const key = line.includes('.')

    const heights = [-1, -1, -1, -1, -1]

    while (line) {
      for (let i = 0; i < 5; i++) {
        if (line[i] === '#') {
          heights[i] += 1
        }
      }
      line = data.shift()
    }

    if (key)
      keys.push(heights)
    else
      locks.push(heights)
  }

  return [locks, keys]
}

function check(lock: number[], key: number[]) {
  for (let i = 0; i < lock.length; i++) {
    if (lock[i] + key[i] >= 6) return false
  }

  return true
}

export function day25a(data: string[]) {
  const [locks, keys] = parse(data);

  let matches = 0
  for (const lock of locks) {
    for (const key of keys) {
      if (check(lock, key)) {
        matches += 1
      }
    }
  }

  return matches;
}
