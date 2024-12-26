export function day3a(data: string[]) {
  const matches = [...data.join('').matchAll(/(mul\((\d+),(\d+)\))/g)]

  let total = 0

 for (const match of matches) {
    const a = Number(match[2]);
    const b = Number(match[3]);

    total = total + (a * b)
  }

  return total
}
