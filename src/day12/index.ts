import run from "@nekosaur/aocrunner";
import { day12a } from "./a";
import { day12b } from "./b";

const parse = (input: string) => input.split('\n');

const part1 = (input: string) => {
  const data = parse(input);

  return day12a(data);
};

const part2 = (input: string) => {
  const data = parse(input);

  return day12b(data);
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
