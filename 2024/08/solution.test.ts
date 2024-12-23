import { beforeAll, describe, expect, it, test } from "bun:test";
import { readFileSync } from "fs";
import {
  getAntinodes,
  getResonantAntinodes,
  resetState,
  solve,
  state,
} from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${__dirname} functions`, () => {
  test("getAntinodes", () => {
    state.map = [10, 10];

    expect(getAntinodes([5, 5], [7, 7])).toEqual([
      [3, 3],
      [9, 9],
    ]);

    expect(getAntinodes([5, 5], [4, 7])).toEqual([
      [6, 3],
      [3, 9],
    ]);

    expect(getAntinodes([5, 5], [5, 5])).toEqual([
      [5, 5],
      [5, 5],
    ]);

    expect(getAntinodes([5, 5], [8, 8])).toEqual([[2, 2]]);
  });

  test("getResonantAntinodes resonant", () => {
    state.map = [10, 10];

    expect(getResonantAntinodes([2, 2], [3, 4])).toEqual([
      [1, 0],
      [2, 2],
      [3, 4],
      [4, 6],
      [5, 8],
    ]);

    // is this correct?
    expect(getResonantAntinodes([2, 2], [4, 4])).toEqual([
      [0, 0],
      [2, 2],
      [4, 4],
      [6, 6],
      [8, 8],
    ]);

    // or does it need to be this? apparently not
    expect(getResonantAntinodes([2, 2], [4, 4])).not.toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 7],
      [8, 8],
      [9, 9],
    ]);
  });
});

describe(`Day ${__dirname} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(14);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(34);
  });

  // Add more test cases if needed
});
