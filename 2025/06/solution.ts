import chalk from "chalk";

type Problem = {
  multiply?: boolean;
  values: number[];
};

export type State = {
  problems: Problem[];
};
export const state: State = { problems: [] };

export const resetState = () => {
  state.problems.length = 0;
};

export const parseInput = (input: string): void => {
  resetState();
  const lines = input
    .split("\n")
    .map((line) => line.replaceAll(/\s+/g, " ").trim());

  const { problems } = state;

  lines.forEach((line, i) => {
    if (!line.length) return;

    const isOperator = line.charAt(0) === "*" || line.charAt(0) === "+";

    line.split(" ").forEach((val, j) => {
      if (i === 0) problems[j] = { values: [] };

      if (!isOperator) {
        problems[j].values.push(Number(val));
        return;
      }

      problems[j].multiply = val === "*";
    });
  });
};

export const answerProblem = ({ values, multiply }: Problem): number => {
  if (multiply === undefined) throw new Error("Multiply operator is undefined");

  if (multiply) return values.reduce((product, val) => product * val, 1);

  return values.reduce((product, val) => product + val, 0);
};

export const answerAllProblems = () => {
  const { problems } = state;

  return problems.reduce(
    (grandTotal, problem) => grandTotal + answerProblem(problem),
    0
  );
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = answerAllProblems();
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
