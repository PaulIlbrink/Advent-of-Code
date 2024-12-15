import chalk from "chalk";

export function solve(input: string): string {
  const lines = input.split("\n").map((line) => line.trim());

  console.log("lines.length", lines.length);

  return `Part is ${chalk.underline.white(
    "not solved yet zaad"
  )}, and part 2 is ${chalk.underline.yellow("not solved yet")}.`;
}
