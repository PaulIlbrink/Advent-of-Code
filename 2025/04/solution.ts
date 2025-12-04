import chalk from "chalk";
import type { Coordinate } from "../../2024/06/solution";

export type State = {
  mapDimensions: Coordinate;
  paperMap: boolean[][];
  rollPositions: Coordinate[];
};

export const state: State = {
  mapDimensions: [0, 0],
  paperMap: [],
  rollPositions: [],
};

export const resetState = () => {
  state.paperMap.length = 0;
  state.mapDimensions = [0, 0];
  state.rollPositions.length = 0;
};

export const parseInput = (input: string): void => {
  resetState();
  const lines = input.split("\n").map((line) => line.trim());

  const { paperMap, rollPositions } = state;

  lines.forEach((line, row) => {
    if (!line.length) return;

    paperMap[row] = [];

    for (let col = 0; col < line.length; col++) {
      const isPaper = line.charAt(col) === "@";
      paperMap[row][col] = isPaper;

      if (isPaper) rollPositions.push([row, col]);
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

export const removeRolls = (
  rolls: Coordinate[],
  preserveState = false
): Coordinate[] => {
  const { paperMap } = state;
  const remainingRolls = rolls.filter(([row, col]) => {
    if (!isAccessible([row, col])) return true;

    if (preserveState) return false;

    paperMap[row][col] = false;
    return false;
  });
  return remainingRolls;
};

const countAccessibleRolls = (): number => countRemovableRolls(false);

const countRemovableRolls = (multipleRounds = true): number => {
  const { rollPositions } = state;

  let totalRemoved = 0;

  let remainingRolls = rollPositions;
  let prevSize = rollPositions.length;
  let removed = 0;

  do {
    remainingRolls = removeRolls(remainingRolls, !multipleRounds);
    removed = prevSize - remainingRolls.length;
    totalRemoved += removed;
    prevSize -= removed;
  } while (multipleRounds && removed > 0);

  return totalRemoved;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = countAccessibleRolls();
  const part1fmt = chalk.underline.white(part1);
  let description = `Initially ${part1fmt} rolls of paper can be accessed`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = countRemovableRolls();
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and in the end a total of ${part2fmt} rolls can be removed.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
