import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import {
  resetState,
  solve,
  lastDigits,
  state,
  testSequence,
  isSequence,
} from "./solution";
import path, { resolve } from "path";

let exampleInput: string;
const dayNumber = path.basename(__dirname);

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${dayNumber} functions`, () => {
  test("testSequence", () => {
    expect(testSequence(1234)).toBeFalse();

    expect(testSequence(1212)).toBeTrue();
  });

  test("lastDigits", () => {
    expect(lastDigits(1234, 2)).toBe(34);

    expect(lastDigits(1234, 4)).toBe(1234);
  });

  test("isSequence", () => {
    expect(isSequence(123123123123, 3)).toBeTrue();
    expect(isSequence(123123123123, 6)).toBeTrue();
    expect(isSequence(123123123123, 9)).toBeFalse();
    expect(isSequence(123123123123, 12)).toBeFalse();
  });
});

describe(`Day ${dayNumber} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    const { productRanges } = state;

    expect(productRanges).toHaveLength(11);

    expect(productRanges[2]).toEqual([998, 1012]);

    expect(part1).toBe(1227775554);
  });

  test.skip("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(123);
  });

  // Add more test cases if needed
});
