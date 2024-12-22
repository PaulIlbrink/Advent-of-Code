import chalk from "chalk";

export enum Operator {
  TIMES = 1,
  DIVIDE = 2,
  PLUS = 3,
  MINUS = 4,
  CONCAT = 5,
}

export type Equation = {
  result: number;
  operands: number[];
  operators?: number[];
};
export type Solution = {
  valid: boolean;
  operators?: Operator[];
};

export type State = {
  equations: Equation[];
};

const state: State = {
  equations: [],
};

export const resetState = () => {
  state.equations.length = 0;
};

// @deprecated
const inverse = (operator: Operator): Operator => {
  switch (operator) {
    case Operator.TIMES:
      return Operator.DIVIDE;
    case Operator.DIVIDE:
      return Operator.TIMES;
    case Operator.PLUS:
      return Operator.MINUS;
    case Operator.MINUS:
      return Operator.PLUS;
    default:
      throw new Error("Invalid operator");
  }
};

export const numberOfDigits = (a: number): number => {
  if (a === 0) return 1;

  if (a > 0) return Math.floor(Math.log10(a)) + 1;

  return numberOfDigits(-1 * a);
};

export const concatFactor = (a: number): number =>
  Math.pow(10, numberOfDigits(a));

export const numberConcat = (a: number, b: number): number =>
  a * concatFactor(b) + b;

export const solveEquation = (
  equation: Equation,
  allowConcat: boolean = false,
  recursiveOperators: Operator[] = []
): Solution => {
  const { result, operands } = equation;
  const solution: Solution = { valid: false };

  const operators = [Operator.TIMES, Operator.PLUS];

  if (allowConcat) operators.push(Operator.CONCAT);

  // we need at least 2 operands
  if (operands.length < 2) solution;

  // exactly 2 operands, so lets do some math evaluation
  if (operands.length === 2) {
    const [a, b] = operands;
    const operator = operators.find((operator) => {
      switch (operator) {
        case Operator.PLUS:
          return result === a + b;
        case Operator.TIMES:
          return result === a * b;
        case Operator.CONCAT:
          return result === numberConcat(a, b);
        default:
          throw new Error("Unknown operator");
      }
    });

    // no operator found, false
    if (!operator) return solution;

    // hey we found a result, true
    solution.valid = true;
    solution.operators = [operator, ...recursiveOperators];
    return solution;
  }

  // we have 3 or more operands, lets do some recursions
  const last = operands.at(-1)!;
  const rest = operands.slice(0, -1);

  const validSubSolution = operators
    .map((operator) => {
      let inverseResult: number;
      switch (operator) {
        case Operator.TIMES:
          inverseResult = result / last;
          break;
        case Operator.PLUS:
          inverseResult = result - last;
          break;
        case Operator.CONCAT:
          const factor = concatFactor(last);
          inverseResult = (result - last) / factor;
          break;
        default:
          throw new Error("Unknown operator");
      }

      const subEquation: Equation = {
        result: inverseResult,
        operands: rest,
      };

      const subSolution = solveEquation(subEquation, allowConcat, [
        operator,
        ...recursiveOperators,
      ]);

      return subSolution;
    })
    .find((subSolution) => subSolution.valid);

  // found a valid solution
  if (validSubSolution) return validSubSolution;

  // no valid solution found
  return solution;
};

const parseInput = (input: string): void => {
  const lines = input.split("\n").map((line) => line.trim());

  const equations: Equation[] = lines.map((line) => {
    const [left, right] = line.split(": ");
    const result = Number(left);
    const operands = right.split(" ").map(Number);
    const operators: number[] = [];
    return { result, operands, operators };
  });

  state.equations.push(...equations);
};

const calibrationResult = (allowConcat = false) => {
  const { equations } = state;
  return equations.reduce((total, equation) => {
    const { valid } = solveEquation(equation, allowConcat);
    if (!valid) return total;

    const { result } = equation;
    return total + result;
  }, 0);
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */

  resetState();
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */

  const result = calibrationResult();

  const part1 = result;
  const part1fmt = chalk.underline.white(part1);
  let description = `The total calibration result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */

  const allowConcat = true;
  const resultWithConcat = calibrationResult(allowConcat);

  const part2 = resultWithConcat;
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and after allowing concat is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
