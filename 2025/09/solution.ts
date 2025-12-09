import chalk from "chalk";
import type { Coordinate } from "../../2024/06/solution";

export type State = {
  redTiles: Coordinate[];
};
export const state: State = { redTiles: [] };

export const resetState = () => {
  state.redTiles.length = 0;
};

export const parseInput = (input: string): void => {
  resetState();
  const lines = input.split("\n").map((line) => line.trim());

  const { redTiles } = state;

  for (const line of lines) {
    const numbers = line.split(",").map(Number);
    if (numbers.length !== 2) continue;
    redTiles.push(numbers as Coordinate);
  }
};

export const squareSize = (
  [xA, yA]: Coordinate,
  [xB, yB]: Coordinate
): number => {
  return (Math.abs(xA - xB) + 1) * (Math.abs(yA - yB) + 1);
};

export const maxSquare = (): number => {
  const { redTiles } = state;
  return redTiles.reduce((maxA, tileA, i) => {
    const max = redTiles.reduce(
      (maxB, tileB, j) => Math.max(maxB, squareSize(tileA, tileB)),
      0
    );
    return Math.max(maxA, max);
  }, 0);
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = maxSquare(); // not solved yet
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
