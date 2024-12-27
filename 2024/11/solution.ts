import chalk from "chalk";
import { numberOfDigits } from "../07/solution";

/* ---------------------------------- Types --------------------------------- */
export type Stone = number; // { value: number; amount: number; nextStones: number[]; }
export type StoneMap = Map<Stone, number>;
export type State = {
  stones: StoneMap;
};

/* ---------------------------------- State --------------------------------- */
export const state: State = {
  stones: new Map(),
};

/* -------------------------------- Functions ------------------------------- */
export const resetState = () => {
  state.stones.clear();
};

export const parseInput = (input: string): void => {
  const { stones } = state;

  const stoneArr = input.split(" ").map(Number);

  // add a single stone to our stone map
  stoneArr.forEach((stone) => stones.set(stone, 1));

  // sanity check
  if (stones.size !== stoneArr.length)
    throw new Error(
      "We are kinda only expecting to have unique stones here without any duplicates"
    );
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
  for (let i = 0; i < times; i++) {
    changeStones(i);
  }

  return countStones();
};

export const countStones = () => {
  const { stones } = state;

  const totalStones = stones
    .values()
    .reduce((total, amount) => (total += amount), 0);

  return totalStones;
};

export const changeStones = (debug: any) => {
  const { stones } = state;

  const blinkMap: StoneMap = new Map();

  for (let [stone, amount] of stones) {
    change(stone).forEach((newStone) => {
      const blinkAmount: number = blinkMap.get(newStone) || 0;
      blinkMap.set(newStone, amount + blinkAmount);
    });
  }

  stones.clear();
  for (let [stone, amount] of blinkMap) {
    stones.set(stone, amount);
  }
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */

  resetState();
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const { stones } = state;

  const part1: number = blink(25);
  const part1fmt = chalk.underline.white(part1);
  let description = `After blinking 25 times there are ${part1fmt} stones, but only ${stones.size} unique ones`;

  /* --------------------------------- Part 2 --------------------------------- */

  const part2: number = blink(75 - 25); // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and after blinking 75 there are ${part2fmt} stones, but only ${stones.size} unique ones.`;

  /* --------------------------------- Result --------------------------------- */

  return { description, part1, part2 };
}
