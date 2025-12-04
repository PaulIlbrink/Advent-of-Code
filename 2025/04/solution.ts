import chalk from "chalk";
import type { Coordinate } from "../../2024/06/solution";

export type State = {
  mapDimensions: Coordinate;
  paperMap: boolean[][];
};

export const state: State = {
  mapDimensions: [0, 0],
  paperMap: [],
};

export const resetState = () => {
  state.paperMap.length = 0;
  state.mapDimensions = [0, 0];
};

export const parseInput = (input: string): void => {
  resetState();
  const lines = input.split("\n").map((line) => line.trim());

  const { paperMap } = state;

  lines.forEach((line, row) => {
    if (!line.length) return;

    paperMap[row] = [];

    for (let col = 0; col < line.length; col++) {
      paperMap[row][col] = line.charAt(col) === "@";
    }
  });

  state.mapDimensions = [paperMap.length, paperMap[0].length];
};

export const isAccessible = (
  [row, col]: Coordinate,
  maxAdjacent = 3
): boolean => {
  if (maxAdjacent > 8)
    throw new Error("The maximum of 8 directions is exceeded");

  let blockedDirections = 0;

  const { paperMap, mapDimensions } = state;
  const [rowEnd, colEnd] = mapDimensions;

  let rowAdj, colAdj;
  for (let i = -1; i <= 1; i++) {
    rowAdj = row + i;
    if (rowAdj < 0 || rowAdj >= rowEnd) continue; // outside of the map

    for (let j = -1; j <= 1; j++) {
      if (j === 0 && i === 0) continue; // don't check yourself

      colAdj = col + j;
      if (colAdj < 0 || colAdj >= colEnd) continue; // outside of the map

      if (paperMap[rowAdj][colAdj]) {
        blockedDirections++;
      }

      if (blockedDirections > maxAdjacent) return false;
    }
  }

  return true;
};

const countAccessibleRolls = (maxAdjacent = 3): number => {
  const { paperMap } = state;

  let accessibleRolls = 0;
  paperMap.forEach((line, row) => {
    line.forEach((isPaper, col) => {
      if (!isPaper) return;

      if (isAccessible([row, col], maxAdjacent)) accessibleRolls++;
    });
  });

  return accessibleRolls;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = countAccessibleRolls();
  const part1fmt = chalk.underline.white(part1);
  let description = `${part1fmt} rolls of paper can be accessed`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
