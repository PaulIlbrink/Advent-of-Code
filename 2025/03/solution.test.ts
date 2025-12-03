import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { getJoltage, resetState, solve, state } from "./solution";
import path, { resolve } from "path";

let exampleInput: string;
const dayNumber = path.basename(__dirname);

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${dayNumber} functions`, () => {
  test("getJoltage", () => {
    expect(getJoltage([9, 8, 1, 1, 1])).toBe(98);

    expect(getJoltage([9, 8, 1, 1, 1, 1, 1, 9])).toBe(99);
  });
});

describe(`Day ${dayNumber} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(357);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(3121910778619);
  });
});
