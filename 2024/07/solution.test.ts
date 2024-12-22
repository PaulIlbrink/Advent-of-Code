import { beforeAll, describe, expect, it, test } from "bun:test";
import { readFileSync } from "fs";
import { Operator, solve, solveEquation } from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
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
});

describe(`Day ${__dirname} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(3749);
  });

  test.skip("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBeUndefined();
  });

  // Add more test cases if needed
});
