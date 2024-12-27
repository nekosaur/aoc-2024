import run from "@nekosaur/aocrunner";
import { day7a } from "./a";
import { day7b } from "./b";

const parse = (input: string) => input.split('\n');

const part1 = (input: string) => {
  const data = parse(input);

  return day7a(data);
};

const part2 = (input: string) => {
  const data = parse(input);

  return day7b(data);
};

run({
  part1: {
    tests: [
      {
        input: `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 3749n,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 11387n,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
