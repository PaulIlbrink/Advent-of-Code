import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { inRange, parseInput, resetState, solve, state } from "./solution";
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
    expect(inRange(1)).toBeFalse();
    expect(inRange(5)).toBeTrue();
    expect(inRange(8)).toBeFalse();
    expect(inRange(17)).toBeTrue();
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
