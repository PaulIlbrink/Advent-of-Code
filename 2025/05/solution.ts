import chalk from "chalk";

export type Range = [first: number, last: number];

export type State = {
  ranges: Range[];
  ingredients: number[];
};
export const state: State = {
  ranges: [],
  ingredients: [],
};

export const resetState = () => {
  state.ranges.length = 0;
  state.ingredients.length = 0;
};

export const parseInput = (input: string): void => {
  resetState();

  const lines = input.split("\n").map((line) => line.trim());

  const { ranges, ingredients } = state;

  lines.forEach((line) => {
    if (line.length === 0) return;

    const numbers = line.split("-").map(Number);
    if (numbers.length === 1) {
      ingredients.push(numbers[0]);
      return;
    }

    ranges.push([numbers[0], numbers[1]]);
  });
};

export const isFresh = (ingredient: number): boolean => {
  const { ranges } = state;
  return ranges.some((range) => inRange(range, ingredient));
};
export const inRange = ([min, max]: Range, val: number): boolean =>
  val >= min && val <= max;

export const countFreshIngredients = (): number => {
  const { ingredients } = state;

  return ingredients.filter((ingredient) => isFresh(ingredient)).length;
};

export const rangeSize = ([min, max]: Range) => {
  return max - min + 1;
};

export const countOverlap = (
  [minA, maxA]: Range,
  [minB, maxB]: Range
): number => {
  if (minB > maxA) return 0;
  if (maxB < minA) return 0;

  if (maxB > maxA) return rangeSize([Math.max(minA, minB), maxA]);

  return rangeSize([minA, Math.min(maxA, maxB)]);
};

export const trimOverlap = ([minA, maxA]: Range, rangeB: Range): Range[] => {
  const [minB, maxB] = rangeB;

  if (minB > maxA) return [rangeB];
  if (maxB < minA) return [rangeB];

  if (minB >= minA && maxB <= maxA) return [];

  if (minB < minA && maxB > maxA)
    return [
      [minB, minA - 1],
      [maxA + 1, maxB],
    ];

  if (minB < minA) return [[minB, minA - 1]];

  return [[maxA + 1, maxB]];
};

export const countFreshIngredientIds = (): number => {
  const { ranges } = state;

  if (ranges.length === 0) return 0;

  let total = 0;

  let remainingRanges: Range[], trimmedRanges: Range[];
  ranges.forEach((range, i) => {
    if (i === 0) {
      total += rangeSize(range);
      return;
    }

    remainingRanges = [range];
    for (let j = 0; j < i; j++) {
      const earlierRange = ranges[j];
      trimmedRanges = [];
      remainingRanges.forEach((rem) => {
        trimmedRanges.push(...trimOverlap(earlierRange, rem));
      });
      remainingRanges = trimmedRanges;
    }

    total += remainingRanges.reduce(
      (remSize, remRange) => remSize + rangeSize(remRange),
      0
    );
  });

  return total;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = countFreshIngredients();
  const part1fmt = chalk.underline.white(part1);
  let description = `There are ${part1fmt} fresh ingredients`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = countFreshIngredientIds(); // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and there are ${part2fmt} unique fresh ingredient ID's.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
