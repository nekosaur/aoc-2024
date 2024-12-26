function blink(stones: number[]) {
  const changed = []
  for (let i = 0; i < stones.length; i++) {
    if (stones[i] === 0) {
      changed.push(1)
    } else if (String(stones[i]).length % 2 === 0) {
      const str = String(stones[i])
      const mid = Math.floor(str.length / 2)
      const [left, right] = [str.slice(0, mid), str.slice(mid)].map(Number)
      changed.push(left, right)
    } else {
      changed.push(stones[i] * 2024)
    }
  }

  return changed
}

export function day11a(data: string[]) {
  let stones = data[0].split(" ").map(Number)

  for (let i = 0; i < 25; i++) {
    stones = blink(stones)
  }

  return stones.length;
}
