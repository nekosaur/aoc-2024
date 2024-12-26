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
