import run from "@nekosaur/aocrunner";
import { day2b } from "./b";
import { day2a } from "./a";

const parse = (input: string) => input.split('\n');

const part1 = (input: string) => {
  const data = parse(input);

  return day2a(data);
};

const part2 = (input: string) => {
  const data = parse(input);

  return day2b(data);
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
