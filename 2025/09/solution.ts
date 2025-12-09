import chalk from "chalk";
import type { Coordinate, CoordinateSet } from "../../2024/06/solution";

export type ColorRange = [start: number, end: number];

export type ColorMap = Map<number, ColorRange[]>;

export type State = {
  redTiles: Coordinate[];
  colColors: ColorMap;
  rowColors: ColorMap;
};
export const state: State = {
  redTiles: [],
  colColors: new Map(),
  rowColors: new Map(),
};

export const resetState = () => {
  state.redTiles.length = 0;
  state.colColors.clear();
  state.rowColors.clear();
};

export const addColorRange = (
  [xA, yA]: Coordinate,
  [xB, yB]: Coordinate
): void => {
  const { colColors, rowColors } = state;

  if (xA !== xB && yA !== yB) throw new Error("Coordinates are not alligned!");

  if (xA === xB) {
    if (!colColors.has(xA)) colColors.set(xA, []);

    colColors.get(xA)!.push([Math.min(yA, yB), Math.max(yA, yB)]);
    return;
  }

  if (!rowColors.has(yA)) rowColors.set(yA, []);

  rowColors.get(yA)!.push([Math.min(xA, xB), Math.max(xA, xB)]);
};

export const parseInput = (input: string): void => {
  resetState();
  const lines = input.split("\n").map((line) => line.trim());

  const { redTiles, colColors, rowColors } = state;

  let prevCoord = lines[lines.length - 1].split(",").map(Number) as Coordinate;
  for (const line of lines) {
    const numbers = line.split(",").map(Number);
    if (numbers.length !== 2) continue;

    const coord = numbers as Coordinate;

    addColorRange(prevCoord, coord);

    redTiles.push(coord);

    prevCoord = coord;
  }
};

export const expandColors = (): void => {
  return;

  //   const { colColors, rowColors } = state;

  //   const colIdxs = [...colColors.keys()].sort((a, b) => a - b);
  //   const rowIdxs = [...rowColors.keys()].sort((a, b) => a - b);

  //   const colIdxsInv = colIdxs.toReversed();
  //   const rowIdxsInv = rowIdxs.toReversed();

  //   const colColorsExp: ColorMap = new Map();
  //   const rowColorsExp: ColorMap = new Map();

  //   // expand columns
  //   for (let [x, [yMin, yMax]] of colColors) {
  //     // lower yMin
  //     for (const y of rowIdxs) {
  //       if (y >= yMin) break;

  //       const [xMin, xMax] = rowColors.get(y)!;
  //       // out of bounds
  //       if (x < xMin || x > xMax) continue;

  //       yMin = y;
  //       break;
  //     }

  //     // increase yMax
  //     for (const y of rowIdxsInv) {
  //       if (y <= yMax) break;

  //       const [xMin, xMax] = rowColors.get(y)!;
  //       // out of bounds
  //       if (x < xMin || x > xMax) continue;

  //       yMax = y;
  //       break;
  //     }

  //     colColorsExp.set(x, [yMin, yMax]);
  //   }

  //   // expand rows
  //   for (let [y, [xMin, xMax]] of rowColors) {
  //     // lower yMin
  //     for (const x of colIdxs) {
  //       if (x >= xMin) break;

  //       const [yMin, yMax] = colColors.get(x)!;
  //       // out of bounds
  //       if (y < yMin || y > yMax) continue;

  //       xMin = x;
  //       break;
  //     }

  //     // increase yMax
  //     for (const x of colIdxsInv) {
  //       if (x <= xMax) break;

  //       const [yMin, yMax] = colColors.get(x)!;

  //       // out of bounds
  //       if (y < yMin || y > yMax) {
  //         continue;
  //       }

  //       xMax = x;
  //       break;
  //     }

  //     rowColorsExp.set(y, [xMin, xMax]);
  //   }

  //   state.colColors = colColorsExp;
  //   state.rowColors = rowColorsExp;
};

export const rectSize = (
  [xA, yA]: Coordinate,
  [xB, yB]: Coordinate
): number => {
  return (Math.abs(xA - xB) + 1) * (Math.abs(yA - yB) + 1);
};

export const isRangeCovered = (
  [startA, endA]: [number, number],
  [startB, endB]: [number, number]
): boolean => {
  return false;
};

export const isFullColor = (
  [xA, yA]: Coordinate,
  [xB, yB]: Coordinate
): boolean => {
  return false;
};

export const maxRectangle = (fullColor = false): number => {
  const { redTiles } = state;

  let max = -1;
  for (const tileA of redTiles) {
    for (const tileB of redTiles) {
      // rectangle is too small, regardless of color
      const size = rectSize(tileA, tileB);
      if (size <= max) continue;

      // has non-colored tiles, abort
      if (fullColor && !isFullColor(tileA, tileB)) {
        continue;
      }

      max = size;
    }
  }

  return max;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = maxRectangle();
  const part1fmt = chalk.underline.white(part1);
  let description = `The largest rectangle covers an area of ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */

  //   expandColors();

  const part2: number = 0; // maxSquare(true); // solved, but wrong
  const part2fmt = chalk.underline.yellow(part2);
  description += `, the largest rectangle using red and green tiles is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
