import chalk from "chalk";
import { concatFactor, numberOfDigits } from "../../2024/07/solution";

export type ProductRange = [start: number, end: number];

export type State = {
  productRanges: ProductRange[];
};

export const state: State = {
  productRanges: [],
};

export const resetState = () => {
  state.productRanges.length = 0;
};

export const lastDigits = (productId: number, digits: number): number => {
  return productId % Math.pow(10, digits);
};

export const testSequence = (productId: number): boolean => {
  if (productId < 10) return false;

  const digits = numberOfDigits(productId);
  if (digits % 2 !== 0) return false;

  const halfDigits = digits / 2;

  const half = lastDigits(productId, halfDigits);

  return productId === Math.pow(10, halfDigits) * half + half;
};

const parseInput = (input: string): void => {
  resetState();
  const lines = input.split("\n").map((line) => line.trim());

  const { productRanges } = state;

  lines.forEach((line) => {
    if (!line.length) return;

    line.split(",").forEach((range) => {
      const splitRange = range.split("-");

      productRanges.push([parseInt(splitRange[0]), parseInt(splitRange[1])]);
    });
  });
};

export const checkForSequnces = (): number => {
  const { productRanges } = state;

  let sequenceTotal = 0;

  productRanges.forEach(([start, end]) => {
    // console.log("checking product range", start, end);
    for (let productId = start; productId <= end; productId++) {
      const validProduct = !testSequence(productId);

      if (validProduct) continue;

      sequenceTotal += productId;
    }
  });

  return sequenceTotal;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = checkForSequnces(); // not solved yet
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
