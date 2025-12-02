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
  test("lastDigits", () => {
    expect(lastDigits(1234, 2)).toBe(34);

    expect(lastDigits(1234, 4)).toBe(1234);
  });

  test("isSequence", () => {
    expect(isSequence(123123123123, 3)).toBeTrue();
    expect(isSequence(123123123123, 6)).toBeTrue();
    expect(isSequence(123123123123, 9)).toBeFalse();
    expect(isSequence(123123123123, 12)).toBeFalse();

    expect(isSequence(11, 1)).toBeTrue();
  });

  test("testSequence", () => {
    expect(testSequence(1234)).toBeFalse();
    expect(testSequence(123123)).toBeTrue();
    expect(testSequence(123123123)).toBeFalse();
    expect(testSequence(123123123, false)).toBeTrue();

    expect(testSequence(11, true)).toBeTrue();
    expect(testSequence(11, false)).toBeTrue();

    expect(testSequence(111, true)).toBeFalse();
    expect(testSequence(111, false)).toBeTrue();
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

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(4174379265);
  });
});
