import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import {
  countOverlap,
  inRange,
  isFresh,
  parseInput,
  resetState,
  solve,
  state,
  trimOverlap,
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
    const { ranges, ingredients } = state;

    expect(ranges).toBeArrayOfSize(4);
    const [first, last] = ranges[2];
    expect(first).toBe(16);
    expect(last).toBe(20);

    expect(ingredients).toBeArrayOfSize(6);
    expect(ingredients[3]).toBe(11);
    expect(ingredients[5]).toBe(32);
  });
});

describe(`Day ${dayNumber} functions`, () => {
  test("isFresh", () => {
    expect(isFresh(1)).toBeFalse();
    expect(isFresh(5)).toBeTrue();
    expect(isFresh(8)).toBeFalse();
    expect(isFresh(17)).toBeTrue();
  });

  test("countOverlap", () => {
    expect(countOverlap([0, 10], [11, 20])).toBe(0);
    expect(countOverlap([0, 10], [8, 20])).toBe(3);
    expect(countOverlap([21, 30], [1, 100])).toBe(10);
    expect(countOverlap([0, 10], [-4, 5])).toBe(6);
  });

  test("trimOverlap", () => {
    expect(trimOverlap([1, 4], [5, 8])).toEqual([[5, 8]]);
    expect(trimOverlap([1, 14], [5, 8])).toEqual([]);

    expect(trimOverlap([1, 6], [5, 8])).toEqual([[7, 8]]);
    expect(trimOverlap([20, 29], [0, 25])).toEqual([[0, 19]]);
    expect(trimOverlap([20, 29], [1, 50])).toEqual([
      [1, 19],
      [30, 50],
    ]);
  });
});

describe(`Day ${dayNumber} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(3);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(14);
  });

  // Add more test cases if needed
});
