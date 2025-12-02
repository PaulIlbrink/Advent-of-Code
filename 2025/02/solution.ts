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

export const isSequence = (
  productId: number,
  sequenceLength: number
): boolean => {
  const digits = numberOfDigits(productId);

  // no sequences possible
  if (digits % sequenceLength !== 0) return false;

  // no repetitions
  const repetitions = digits / sequenceLength;
  if (repetitions <= 1) return false;

  // check all sequences
  const sequence = lastDigits(productId, sequenceLength);
  let calcSequence = 0;
  for (let rep = 0; rep < repetitions; rep++) {
    calcSequence += Math.pow(10, rep * sequenceLength) * sequence;
  }

  return calcSequence === productId;
};

export const testSequence = (
  productId: number,
  onlyOneRepetition = true
): boolean => {
  if (productId < 10) return false;

  const digits = numberOfDigits(productId);

  let sequenceLength = Math.ceil(digits / 2);

  for (sequenceLength; sequenceLength > 0; sequenceLength--) {
    const valid = isSequence(productId, sequenceLength);

    if (valid || onlyOneRepetition) return valid;
  }

  return false;
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

export const checkForSequences = (multipleRepetitions = false): number => {
  const { productRanges } = state;

  let sequenceTotal = 0;

  productRanges.forEach(([start, end]) => {
    for (let productId = start; productId <= end; productId++) {
      const validProduct = !testSequence(productId, !multipleRepetitions);

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
  const part1: number = checkForSequences(); // not solved yet
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = checkForSequences(true); // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
