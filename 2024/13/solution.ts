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
  strategy?: Strategy;
};
export type Strategy = {
  a: number;
  b: number;
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

export enum TOKENS {
  BTN_A = 3,
  BTN_B = 1,
}

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
  let matches: RegExpExecArray | null;

  if (lines.length < inputPatterns.length)
    throw new Error("Missing input, not enough lines for a single machine");

  // parse the machines
  lines.forEach((line, i) => {
    // ignore empty line
    if (line === "") return;

    // execute the regex
    matches = inputPatterns[inputState].exec(line);

    // invalid input
    if (matches === null || !matches.groups)
      throw new Error(
        `Invalid input, "${line}" is not a valid ${
          inputState === INPUT_STATE.PRIZE ? "prize" : "button"
        }.`
      );

    // valid input, push the naming groups into an array
    machineGroups.push(matches.groups);

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
      `Incomplete input, only ${machineGroups.length} lines found for the final machine.`
    );
};

// find a winning strategy f
export const findStrategy = (
  machine: Machine,
  prizePositionCorrection: number = 0
): void => {
  const {
    a: { x: Ax, y: Ay },
    b: { x: Bx, y: By },
    prize: { x: Px, y: Py },
  } = machine;

  const PxC = Px + prizePositionCorrection;
  const PyC = Py + prizePositionCorrection;

  const As = (By * PxC - Bx * PyC) / (By * Ax - Bx * Ay);
  const Bs = (Ay * PxC - Ax * PyC) / (Ay * Bx - Ax * By);

  machine.strategy = {
    a: As,
    b: Bs,
  };
};

export const solveMachines = (prizePositionCorrection: number = 0) => {
  const { machines } = state;
  machines.forEach((m) => findStrategy(m, prizePositionCorrection));
};

export const calculateTokens = (): number => {
  const { machines } = state;

  return machines.reduce((tokens, machine) => {
    // no solution
    if (!machine.strategy)
      throw new Error(`No strategy for machine ${machine}`);

    const { a, b } = machine.strategy;

    // fractions, there's no such thing as half button presses
    if (!Number.isInteger(a) || !Number.isInteger(b)) return tokens;

    tokens += a * TOKENS.BTN_A + b * TOKENS.BTN_B;

    return tokens;
  }, 0);
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  solveMachines();

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = calculateTokens(); // not solved yet
  const part1fmt = chalk.underline.white(part1);
  let description = `To win all possible prizes you need to spend ${part1fmt} tokens`;

  /* --------------------------------- Part 2 --------------------------------- */

  solveMachines(10000000000000);

  const part2: number = calculateTokens(); // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and after correcting the conversion mistake you need to spend ${part2fmt} tokens.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
