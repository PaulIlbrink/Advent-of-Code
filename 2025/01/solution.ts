import chalk from "chalk";

export type State = {
  moves: number[];
};
export type Turn = [dialPosition: number, zeroTicks: number];
export type SafeCodes = [simple: number, advanced: number];

export const state: State = {
  moves: [],
};

export const resetState = () => {
  state.moves.length = 0;
};

const parseInput = (input: string): void => {
  resetState();

  const lines = input.split("\n").map((line) => line.trim());

  const { moves } = state;

  lines.forEach((line) => {
    if (line.length === 0) return;

    let move = parseInt(line.substring(1), 10);

    if (line.charAt(0) === "L") move *= -1;

    moves.push(move);
  });
};

export const turn = (position: number, rotation: number): Turn => {
  let zeros = Math.floor(Math.abs(rotation) / 100);
  let newPosition = position + (rotation % 100);

  if (newPosition < 0) {
    newPosition += 100;

    if (position !== 0) zeros++;
  } else if (newPosition >= 100) {
    if (newPosition > 100) zeros++;

    newPosition -= 100;
  }

  if (newPosition === 0) zeros++;

  return [newPosition, zeros];
};

export const openSafe = (): SafeCodes => {
  let { moves } = state;

  let dialPosition = 50;
  let zeros;

  const codes: SafeCodes = moves.reduce(
    ([simple, advanced], move) => {
      [dialPosition, zeros] = turn(dialPosition, move);

      if (dialPosition === 0) simple++;

      advanced += zeros;

      return [simple, advanced];
    },
    [0, 0]
  );

  return codes;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const [part1, part2] = openSafe();
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
