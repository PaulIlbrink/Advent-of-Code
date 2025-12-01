import chalk from "chalk";

export type State = {
  position: number;
  moves: number[];
  history: number[];
  includePasses: boolean;
};
export const state: State = {
  position: 50,
  moves: [],
  history: [],
  includePasses: false,
};

export const resetState = () => {
  state.position = 50;
  state.moves = [];
  state.includePasses = false;
};

const parseInput = (input: string): void => {
  resetState();
  const lines = input.split("\n").map((line) => line.trim());

  const {} = state;

  lines.forEach((line) => {
    if (line.length === 0) return;

    let move = parseInt(line.substring(1), 10);
    if (line.charAt(0) === "L") move = -move;
    state.moves.push(move);
  });
};

export const turn = (rotation: number): number => {
  let { position: start, includePasses } = state;
  let zeros = 0;

  const raw = start + rotation;
  const end = (raw + 100) % 100;

  state.position = end;

  if (end === 0) zeros++;

  if (!includePasses) {
    return zeros;
  }

  if (raw < 0) {
    zeros += Math.ceil((-1 * (raw + start)) / 100);
  } else {
    zeros += Math.floor(raw / 100);
  }

  return zeros;
};

export const openSafe = () => {
  let { moves } = state;

  let zeros = 0;
  for (let move of moves) {
    zeros += turn(move);
  }

  return zeros;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = openSafe(); // not solved yet
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  resetState();
  parseInput(input);
  state.includePasses = true;

  const part2: number = openSafe(); // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
