import chalk from "chalk";

type BatteryBank = number[];

export type State = {
  batteryBanks: BatteryBank[];
};
export const state: State = {
  batteryBanks: [],
};

export const resetState = () => {
  state.batteryBanks.length = 0;
};

const parseInput = (input: string): void => {
  resetState();
  const lines = input.split("\n").map((line) => line.trim());

  const { batteryBanks } = state;

  lines.forEach((line) => {
    if (!line.length) return;

    batteryBanks.push(line.split("").map(Number));
  });
};

export const getJoltage = (bank: BatteryBank, batteryCount = 2): number => {
  if (bank.length < batteryCount) return 0;

  if (batteryCount < 1) throw new Error("Battery count should be 1 or higher");

  if (batteryCount === 1) return Math.max(...bank);

  batteryCount--;

  const maxDigit = Math.max(...bank.slice(0, -batteryCount));
  const digitIdx = bank.indexOf(maxDigit);

  const joltage = maxDigit * Math.pow(10, batteryCount);

  const partialBank = bank.slice(digitIdx + 1);
  const remainingJoltage = getJoltage(partialBank, batteryCount);

  return joltage + remainingJoltage;
};

export const getTotalJoltage = (batteryCount = 2): number => {
  const { batteryBanks } = state;
  const total = batteryBanks.reduce(
    (joltage, bank) => (joltage += getJoltage(bank, batteryCount)),
    0
  );

  return total;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = getTotalJoltage(2); //
  const part1fmt = chalk.underline.white(part1);
  let description = `The total joltage with 2 batteries per bank is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = getTotalJoltage(12); // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and the total Joltage with 12 batteries per bank is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
