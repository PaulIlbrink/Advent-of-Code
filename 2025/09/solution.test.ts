import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { parseInput, resetState, solve, squareSize, state } from "./solution";
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
    const { redTiles } = state;

    expect(redTiles).toBeArrayOfSize(8);

    expect(redTiles[3]).toEqual([9, 7]);
  });
});

describe(`Day ${dayNumber} functions`, () => {
  test("squareSize", () => {
    expect(squareSize([1, 1], [1, 1])).toBe(1);
    expect(squareSize([1, 1], [2, 2])).toBe(4);
    expect(squareSize([2, 2], [1, 1])).toBe(4);

    expect(squareSize([2, 2], [-2, -2])).toBe(25);

    expect(squareSize([2, 2], [22, 2])).toBe(21);
  });
});

describe(`Day ${dayNumber} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(50);
  });

  test.skip("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(123);
  });
});
