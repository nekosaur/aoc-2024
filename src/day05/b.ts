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

function fix(update: number[], rules: [number, number][]) {
  for (let i = 1; i < update.length; i++) {
    const left = update[i - 1]
    const right = update[i]

    if (rules.find(rule => rule[0] === right && rule[1] === left)) {
      update[i - 1] = right
      update[i] = left

      update = fix(update, rules)
    }
  }

  return update;
}

export function day5b(data: string[]) {
  const emptyLineIndex = data.findIndex(line => line === "")
  const rules = data.slice(0, emptyLineIndex).map(line => line.split("|").map(Number) as [number, number])
  const updates = data.slice(emptyLineIndex + 1).map(line => line.split(",").map(Number))

  const invalid = updates.filter(update => !check(update, rules))

  const fixed = invalid.map(update => fix(update, rules))

  const sum = fixed.reduce((curr, update) => curr + update[Math.floor(update.length / 2)], 0)

  return sum;
}
