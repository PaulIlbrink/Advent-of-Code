import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import {
  concatFactor,
  numberConcat,
  numberOfDigits,
  Operator,
  resetState,
  solve,
  solveEquation,
} from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${__dirname} functions`, () => {
  test("solveEquation", () => {
    const twelve = solveEquation({ result: 12, operands: [3, 4] });

    expect(twelve.valid).toBe(true);
    expect(twelve.operators).not.toBeUndefined();
    expect(twelve.operators).toEqual([Operator.TIMES]);

    const sixteen = solveEquation({ result: 16, operands: [1, 2, 8] });

    expect(sixteen.valid).toBe(true);
    expect(sixteen.operators).toBeArray();
    expect(sixteen.operators).toHaveLength(2);
    expect(sixteen.operators).toEqual([Operator.TIMES, Operator.TIMES]);

    const twentyFour = solveEquation({ result: 24, operands: [1, 2, 8] });

    expect(twentyFour.valid).toBe(true);
    expect(twentyFour.operators).toBeArray();
    expect(twentyFour.operators).toHaveLength(2);
    expect(twentyFour.operators).toEqual([Operator.PLUS, Operator.TIMES]);
  });

  test("numberConcat and helpers", () => {
    expect(numberOfDigits(12345)).toBe(5);
    expect(numberOfDigits(123)).toBe(3);
    expect(numberOfDigits(10)).toBe(2);
    expect(numberOfDigits(5)).toBe(1);
    expect(numberOfDigits(0)).toBe(1);

    expect(concatFactor(1)).toBe(10);
    expect(concatFactor(12)).toBe(100);
    expect(concatFactor(1730)).toBe(10000);

    expect(numberConcat(12, 34)).toBe(1234);
  });

  test("concat equations", () => {
    const concatEqI = solveEquation({ result: 156, operands: [15, 6] }, true);
    expect(concatEqI.valid).toBeTrue();

    // 192 = 17 || 8 + 14
    const concatEqII = solveEquation(
      { result: 192, operands: [17, 8, 14] },
      true
    );
    expect(concatEqII.valid).toBeTrue();

    // 486 = 6 * 8 || 6
    const concatEqIII = solveEquation(
      { result: 486, operands: [6, 8, 6] },
      true
    );
    expect(concatEqIII.valid).toBeTrue();
  });
});

describe(`Day ${__dirname} examples`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(3749);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(11387);
  });

  // Add more test cases if needed
});
