import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { isAccessible, parseInput, resetState, solve, state } from "./solution";
import path, { resolve } from "path";
import { CoordinateSet } from "../../2024/06/solution";

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

  test("map dimensions", () => {
    const { mapDimensions, paperMap } = state;

    expect(mapDimensions).toBeArrayOfSize(2);
    expect(mapDimensions).toEqual([10, 10]);

    expect(paperMap).toBeArrayOfSize(10);
    expect(paperMap[0]).toBeArrayOfSize(10);
  });

  test("paper rolls", () => {
    const { paperMap } = state;

    expect(paperMap[0][0]).toBeFalse();
    expect(paperMap[0][1]).toBeFalse();
    expect(paperMap[0][8]).toBeTrue();
    expect(paperMap[0][9]).toBeFalse();

    expect(paperMap[1][0]).toBeTrue();
    expect(paperMap[1][1]).toBeTrue();
    expect(paperMap[1][5]).toBeFalse();
  });
});

describe(`Day ${dayNumber} functions`, () => {
  beforeEach(() => {
    parseInput(exampleInput);
  });

  test("isAccessible", () => {
    expect(isAccessible([0, 0])).toBeTrue();

    expect(isAccessible([0, 0], 8)).toBeTrue();
    expect(isAccessible([0, 0], 2)).toBeTrue();
    expect(isAccessible([0, 0], 1)).toBeFalse();
    expect(isAccessible([0, 0], 0)).toBeFalse();
  });
});

describe(`Day ${dayNumber} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(13);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(43);
  });

  // Add more test cases if needed
});
