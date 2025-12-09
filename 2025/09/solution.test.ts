import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import {
  isFullColor,
  parseInput,
  resetState,
  solve,
  rectSize,
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
    let { redTiles, rowColors, colColors } = state;

    expect(redTiles).toBeArrayOfSize(8);

    expect(redTiles[3]).toEqual([9, 7]);

    expect(colColors).toHaveLength(4);

    const colKeys = colColors.keys().toArray();
    expect(colKeys).toBeArrayOfSize(4);
    expect(new Set(colKeys)).toEqual(new Set([2, 7, 9, 11]));

    const rowKeys = rowColors.keys().toArray();
    expect(rowKeys).toBeArrayOfSize(4);
    expect(new Set(rowKeys)).toEqual(new Set([1, 3, 5, 7]));

    expect(colColors.has(0)).toBeFalse();
    expect(colColors.has(2)).toBeTrue();
    expect(colColors.get(2)).toEqual([[3, 5]]);
    expect(colColors.get(4)).toBeUndefined();

    expect(rowColors).toHaveLength(4);
    expect(rowColors.has(0)).toBeFalse();
    expect(rowColors.has(1)).toBeTrue();
    expect(rowColors.get(1)).toEqual([[7, 11]]);
    expect(rowColors.get(3)).toEqual([[2, 7]]);
    expect(rowColors.get(4)).toBeUndefined();

    // expand color ranges
    expect(colColors.get(7)).toEqual([[1, 3]]);
    expect(rowColors.get(3)).toEqual([[2, 7]]);

    // expandColors();
    // colColors = state.colColors;
    // rowColors = state.rowColors;
    // expect(colColors.get(7)).not.toEqual([[1, 3]]);
    // expect(colColors.get(7)).toEqual([[1, 5]]);
    // expect(rowColors.get(3)).not.toEqual([[2, 7]]);
    // expect(rowColors.get(3)).toEqual([[2, 11]]);
  });
});

describe(`Day ${dayNumber} functions`, () => {
  test("squareSize", () => {
    expect(rectSize([1, 1], [1, 1])).toBe(1);
    expect(rectSize([1, 1], [2, 2])).toBe(4);
    expect(rectSize([2, 2], [1, 1])).toBe(4);

    expect(rectSize([2, 2], [-2, -2])).toBe(25);

    expect(rectSize([2, 2], [22, 2])).toBe(21);
  });

  test("isFullColor", () => {
    parseInput(exampleInput);

    expect(isFullColor([7, 1], [11, 7])).toBeFalse();

    // expect(isFullColor([2, 3], [9, 5])).toBeFalse();
    // expandColors();
    // expect(isFullColor([2, 3], [9, 5])).toBeTrue();
  });
});

describe(`Day ${dayNumber} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(50);
  });

  test.skip("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(24);
  });
});
