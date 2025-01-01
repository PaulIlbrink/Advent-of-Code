import chalk from "chalk";

export type Coordinate = {
  x: number;
  y: number;
};
export type Button = Coordinate;
export type Machine = {
  a: Button;
  b: Button;
  prize: Coordinate;
};
export type State = {
  machines: Machine[];
};
export const state: State = {
  machines: [],
};

export const resetState = () => {
  state.machines.length = 0;
};

export const patternButton =
  /^Button (?<btn>A|B): X(?<x>[+-]\d+) Y(?<y>[+-]\d+)$/;
export const patternPrize = /^Prize: X=(?<x>\d+), Y=(?<y>\d+)$/;

export const parseInput = (input: string): void => {
  resetState();

  const lines = input.split("\n").map((line) => line.trim());
  new Iterator(lines);

  const {} = state;

  lines.forEach((line) => {});
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
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
