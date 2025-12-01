import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resetState, solve } from "./solution";
import path, { resolve } from "path";

let exampleInput: string;
const dayNumber = path.basename(__dirname);

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${dayNumber} functions`, () => {
  test.skip("some day specific function", () => {
    const foo = null;

    expect(foo).toBeTrue();
  });
});

describe(`Day ${dayNumber} example`, () => {
  test.skip("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(123);
  });

  test.skip("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(123);
  });

  // Add more test cases if needed
});
