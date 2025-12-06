import chalk from "chalk";
import { numberOfDigits } from "../../2024/07/solution";

type Value = [value: number, padding: number];
type Problem = {
  multiply?: boolean;
  values: Value[];
  problemIndex: number;
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
  const lines = input.split("\n");

  const { problems } = state;

  let operatorIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[lines.length - 1 - i];

    if (!line.trim().length) return;

    const trimmedLine = line.replaceAll(/\s+/g, " ").trim();

    trimmedLine.split(" ").forEach((val, j) => {
      if (i === 0) {
        operatorIndex = line.indexOf(val, operatorIndex);
        problems[j] = {
          values: [],
          problemIndex: operatorIndex,
          multiply: val === "*",
        };
        operatorIndex++;
        return;
      }

      const { problemIndex } = problems[j];

      const value = Number(val);
      const padding = line.indexOf(String(value), problemIndex) - problemIndex;
      problems[j].values.unshift([value, padding]);
    });
  }
};

export const answerProblem = (
  { values, multiply }: Problem,
  rtl = false
): number => {
  if (multiply === undefined) throw new Error("Multiply operator is undefined");

  if (multiply)
    return values.reduce((product, [val, _padding]) => product * val, 1);

  return values.reduce((product, [val, _padding]) => product + val, 0);
};

export const mapProblemToRtl = ({
  values,
  multiply,
  problemIndex,
}: Problem): Problem => ({
  values: mapValuesToRtl(values),
  multiply,
  problemIndex,
});

export const indexDigitChar = (val: number, idx: number, padding = 0): string =>
  String(val).charAt(idx - padding);

export const mapValuesToRtl = (values: Value[]): Value[] => {
  if (!values.length) return values;

  const [_, firstPadding] = values[0];

  // already mapped (padding < 0)
  if (firstPadding < 0) return values;

  const rtlValues: Value[] = [];

  const maxDigits = values.reduce(
    (max, [val, padding]) => Math.max(max, padding + numberOfDigits(val)),
    -1
  );

  for (let i = 0; i < maxDigits; i++) {
    const rtlVal = values.reduce(
      (concat, [val, padding]) => concat + indexDigitChar(val, i, padding),
      ""
    );
    rtlValues.push([Number(rtlVal), -1]);
  }

  return rtlValues;
};

export const answerAllProblems = (rtl = false) => {
  let { problems } = state;

  if (rtl) {
    problems = problems.map(mapProblemToRtl);
  }

  return problems.reduce(
    (grandTotal, problem) => grandTotal + answerProblem(problem, rtl),
    0
  );
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = answerAllProblems();
  const part1fmt = chalk.underline.white(part1);
  let description = `The grand total of all answers is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = answerAllProblems(true);
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and after applying actual Cephalopod math it is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
