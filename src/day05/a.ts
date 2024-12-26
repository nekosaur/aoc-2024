function check(update: number[], rules: [number, number][]) {
  for (let i = 1; i < update.length; i++) {
    const left = update[i - 1]
    const right = update[i]

    if (rules.find(rule => rule[0] === right && rule[1] === left)) {
      return false
    }
  }

  return true;
}

export function day5a(data: string[]) {
  const emptyLineIndex = data.findIndex(line => line === "")
  const rules = data.slice(0, emptyLineIndex).map(line => line.split("|").map(Number) as [number, number])
  const updates = data.slice(emptyLineIndex + 1).map(line => line.split(",").map(Number))
  const valid = updates.filter(update => check(update, rules))
  const sum = valid.reduce((curr, update) => curr + update[Math.floor(update.length / 2)], 0)

  return sum;
}
