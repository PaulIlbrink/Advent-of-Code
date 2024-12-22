import chalk from "chalk";

export type State = {
  // prop: []
};
const state: State = {};

export const resetState = () => {
  // state.prop = [];
};

const parseInput = (input: string): void => {
  const lines = input.split("\n").map((line) => line.trim());

  const {} = state;

  lines.forEach((line) => {});
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  resetState();
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */

  const part1: number = 0; // not solved yet
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */

  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
