function generateCombinationsWithRepetition<T>(values: T[], k: number) {
  const result: T[][] = [];

  function helper(current: T[]) {
      // If the current combination reaches the desired length, add it to the result
      if (current.length === k) {
          result.push([...current]);
          return;
      }

      // Iterate through the values and try each value for the current position
      for (let i = 0; i < values.length; i++) {
          current.push(values[i]);
          helper(current); // Recurse without incrementing a "start" index (repetition allowed)
          current.pop(); // Backtrack
      }
  }

  helper([]); // Start with an empty combination
  return result;
}

type Operation = (a: bigint, b: bigint) => bigint

const add = (a: bigint, b: bigint) => a + b
const mul = (a: bigint, b: bigint) => a * b

function solve(value: bigint, numbers: bigint[], operations: Operation[]) {
  const permutations = generateCombinationsWithRepetition(operations, numbers.length)

  return permutations.map(operations => {
    let sum = numbers[0]
    for (let i = 1; i < numbers.length; i++) {
      const op = operations.shift()
      sum = op(sum, numbers[i])
    }
    return sum
  }).some(sum => sum === value)
}

export function day7a(data: string[]) {
  const equations = data.map(line => {
    const [value, numbers] = line.split(": ")
    return { value: BigInt(value), numbers: numbers.split(" ").map(BigInt) }
  })

  const valid = equations.filter(({ value, numbers }) => {
    return solve(value, numbers, [add, mul])
  })

  return valid.reduce((curr, valid) => curr + valid.value, BigInt(0));
}
