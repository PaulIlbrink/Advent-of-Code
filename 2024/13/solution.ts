import chalk from "chalk";

export type Coordinate = {
  x: number;
  y: number;
};
export type Button = Coordinate;
export type Machine = {
  a: Button;
  b: Button;
  prize: Coordinate;
};

export enum INPUT_STATE {
  BTN_A = 0,
  BTN_B = 1,
  PRIZE = 2,
}

export type State = {
  machines: Machine[];
};
export const state: State = {
  machines: [],
};

export const resetState = () => {
  state.machines.length = 0;
};

export const patternButton =
  /^Button (?<btn>A|B): X(?<x>[+-]\d+), Y(?<y>[+-]\d+)$/;
export const patternPrize = /^Prize: X=(?<x>\d+), Y=(?<y>\d+)$/;

export const parseInput = (input: string): void => {
  resetState();

  const { machines } = state;

  let inputState = INPUT_STATE.BTN_A;
  const inputPatterns = [patternButton, patternButton, patternPrize];
  const machineGroups: Record<string, string>[] = [];

  const lines = input.split("\n").map((line) => line.trim());
  if (lines.length < inputPatterns.length)
    throw new Error("Invalid input, not enough lines for a single machine");

  // parse the machines
  lines.forEach((line, i) => {
    // ignore empty line
    if (line === "") return;

    // invalid input
    if (!inputPatterns[inputState].test(line))
      throw new Error(
        `Input "${line}" doesn't match the expected machine pattern ${inputPatterns[inputState]}`
      );

    // valid input, push the naming groups into an array
    machineGroups.push(inputPatterns[inputState].exec(line)!.groups!);

    // be ready for next input
    inputState = (inputState + 1) % 3;

    // we can build a machine
    if (machineGroups.length === inputPatterns.length) {
      machines.push(
        ["a", "b", "prize"].reduce<Partial<Machine>>((machine, prop, i) => {
          machine[prop as keyof Machine] = {
            x: Number(machineGroups[i].x),
            y: Number(machineGroups[i].y),
          };
          return machine;
        }, {}) as Machine
      );

      // clear the naming groups for the next machine
      machineGroups.length = 0;
    }
  });

  // somehow doesn't get here
  if (machineGroups.length > 0)
    throw new Error(
      `Incomplete input, can't make a make machine with ${machineGroups}`
    );
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = 0; // not solved yet
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
