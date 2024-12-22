import chalk from "chalk";

export enum Operator {
  TIMES = "*",
  DIVIDE = "/",
  PLUS = "+",
  MINUS = "-",
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

const resetState = () => {
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

export const solveEquation = (
  equation: Equation,
  recursiveOperators: Operator[] = []
): Solution => {
  const { result, operands } = equation;
  const solution: Solution = { valid: false };

  const operators = [Operator.TIMES, Operator.PLUS];

  // we need at least 2 operands
  if (operands.length < 2) solution;

  // exactly 2 operands, so lets do some math evaluation
  if (operands.length === 2) {
    const [a, b] = operands;
    const operator = operators.find((operator) => {
      switch (operator) {
        case Operator.TIMES:
          return result === a * b;
        case Operator.PLUS:
          return result === a + b;
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
        default:
          throw new Error("Unknown operator");
      }

      const subEquation: Equation = {
        result: inverseResult,
        operands: rest,
      };

      const subSolution = solveEquation(subEquation, [
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

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */

  resetState();
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */

  const { equations } = state;

  // solve the equations
  const totalCalibrationResult = equations.reduce((total, equation) => {
    const { valid } = solveEquation(equation);
    if (!valid) return total;

    const { result } = equation;
    return total + result;
  }, 0);

  const part1 = totalCalibrationResult;
  const part1fmt = chalk.underline.white(part1);
  let description = `The total calibration result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */

  const part2 = "not solved yet";
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1 };
}
