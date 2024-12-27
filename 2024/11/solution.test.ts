import { beforeAll, describe, expect, it, test } from "bun:test";
import { readFileSync } from "fs";
import {
  blink,
  change,
  parseInput,
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
  test("change", () => {
    let result = change(0);
    expect(result).toBeArray();
    expect(result).toEqual([1]);

    result = change(12);
    expect(result).toEqual([1, 2]);

    result = change(1000);
    expect(result).toEqual([10, 0]);

    result = change(123);
    expect(result).toEqual([123 * 2024]);
  });

  test("blink", () => {
    parseInput("0 1 10 99 999");

    const { stones } = state;

    expect(stones).toBeArray();
    expect(stones).toHaveLength(5);
    expect(stones).toEqual([0, 1, 10, 99, 999]);

    blink();

    expect(stones).toEqual([1, 2024, 1, 0, 9, 9, 2021976]);
    expect(stones).toHaveLength(7);
  });
});

describe(`Day ${__dirname} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(55312);
  });

  test.skip("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(123);
  });

  // Add more test cases if needed
});
