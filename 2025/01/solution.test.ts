import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resetState, solve, turn } from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${__dirname} functions`, () => {
  test("some day specific function", () => {
    let testMove = turn(50, 15);
    expect(testMove).toBeInteger();
    expect(testMove).toBe(65);

    expect(turn(65, 65)).toBe(30);
    expect(turn(65, -150)).toBe(15);
  });
});

describe(`Day ${__dirname} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(3);
  });

  test.skip("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(123);
  });

  // Add more test cases if needed
});
