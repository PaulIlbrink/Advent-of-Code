import { beforeAll, describe, expect, it } from "bun:test";
import { readFileSync } from "fs";
import { solve } from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
});

describe("Day 05 example", () => {
  it("Part 1 example", () => {
    const { part1 } = solve(exampleInput);
    expect(part1).toBe(143);
  });

  it("Part 2 example", () => {
    const { part2 } = solve(exampleInput);
    expect(part2).toBe(123);
  });
  // Add more test cases if needed
});
