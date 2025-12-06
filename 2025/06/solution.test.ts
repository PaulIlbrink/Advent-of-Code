import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import {
  answerProblem,
  mapToRtl,
  mapValuesToRtl,
  parseInput,
  resetState,
  solve,
  state,
} from "./solution";
import path, { resolve } from "path";

let exampleInput: string;
const dayNumber = path.basename(__dirname);

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${dayNumber} input`, () => {
  beforeEach(() => {
    parseInput(exampleInput);
  });

  test("state props", () => {
    const { problems } = state;

    expect(problems).toBeArrayOfSize(4);

    const firstProblem = problems[0];
    expect(firstProblem.values).toBeArrayOfSize(3);
    expect(firstProblem.values).toEqual([
      [123, 0],
      [45, 1],
      [6, 2],
    ]);
    expect(firstProblem.multiply).toBeBoolean();
    expect(firstProblem.multiply).toBeTrue();

    const lastProblem = problems[3];
    expect(lastProblem.values).toBeArrayOfSize(3);
    expect(lastProblem.values).toEqual([
      [64, 0],
      [23, 0],
      [314, 0],
    ]);
    expect(lastProblem.multiply).toBeBoolean();
    expect(lastProblem.multiply).toBeFalse();
  });
});

describe(`Day ${dayNumber} functions`, () => {
  test("answerProblem", () => {
    // expect(answerProblem({ values: [1, 2, 3] })).toThrowError(
    //   "Multiply operator is undefined"
    // );

    expect(
      answerProblem({
        values: [
          [1, 0],
          [2, 0],
          [3, 0],
          [4, 0],
        ],
        multiply: false,
        problemIndex: -1,
      })
    ).toBe(10);
    expect(
      answerProblem({
        values: [
          [1, 0],
          [2, 0],
          [3, 0],
          [4, 0],
        ],
        multiply: true,
        problemIndex: -1,
      })
    ).toBe(24);
  });

  test("mapValuesToRtl", () => {
    expect(mapValuesToRtl([64, 23, 314])).toEqual([623, 431, 4]);
  });
});

describe(`Day ${dayNumber} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(4277556);
  });

  test.skip("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(3263827);
  });
});
