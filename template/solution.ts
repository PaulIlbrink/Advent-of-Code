import chalk from "chalk";

export function solve(input: string): SolveResult {
  const lines = input.split("\n").map((line) => line.trim());

  console.log("lines.length", lines.length);

  return {
    description: `Part is ${chalk.underline.white(
      "not solved yet"
    )}, and part 2 is ${chalk.underline.yellow("not solved yet")}.`,
  };
}
