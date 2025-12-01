import chalk from "chalk";

export type State = {
  position: number;
  moves: number[];
  history: number[];
};
export const state: State = { position: 50, moves: [], history: [] };

export const resetState = () => {
  state.position = 50;
  state.moves = [];
  state.history = [];
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

export const turn = (start: number, rotation: number): number => {
  return (start + rotation + 100) % 100;
};

export const openSafe = () => {
  let { position, moves, history } = state;

  history.push(position);
  for (let move of moves) {
    state.position = turn(state.position, move);
    history.push(state.position);
  }

  return history.filter((pos) => pos === 0).length;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = openSafe(); // not solved yet
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
