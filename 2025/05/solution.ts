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

export const isFresh = (ingredient: number): boolean => inRange(ingredient);
export const inRange = (val: number): boolean => {
  const { ranges } = state;

  return ranges.some(([min, max]) => val >= min && val <= max);
};

export const countFreshIngredients = (): number => {
  const { ingredients } = state;

  return ingredients.filter((ingredient) => inRange(ingredient)).length;
};

export const countFreshIngredientIds = (): number => {
  const { ranges } = state;

  const previousRanges: Range[] = [];
  let total = 0;

  ranges.forEach(([min, max], idx) => {
    // do smart stuff
    total++;
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
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
