import chalk from "chalk";
import { numberOfDigits } from "../07/solution";

export type Stone = number;

export type State = {
  stones: Stone[];
};
export const state: State = {
  stones: [],
};

export const resetState = () => {
  state.stones.length = 0;
};

export const parseInput = (input: string): void => {
  state.stones = input.split(" ").map(Number);
};

export const change = (stone: Stone): Stone[] => {
  if (stone === 0) return [1];

  const digits = numberOfDigits(stone);
  if (digits % 2 === 0) {
    const factor = Math.pow(10, digits / 2);
    const left = Math.floor(stone / factor);
    const right = stone - left * factor;
    return [left, right];
  }

  return [stone * 2024];
};

export const blink = (times = 1): number => {
  const { stones } = state;
  
  for (let i = 0; i < times; i++) {
    changeStones();
  }

  return stones.length;
};

export const changeStones = () => {
  const { stones } = state;
  const lastLength = stones.length;

  for (let i = 0; i < lastLength; i++) {
    stones.push(...change(stones[i]));
  }

  stones.splice(0, lastLength);
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */

  resetState();
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */

  const part1: number = blink(25);
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */

  const part2: number = 0; //  blink(75 - 25); // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */

  return { description, part1, part2 };
}
