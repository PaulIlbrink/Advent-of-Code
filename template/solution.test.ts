import { beforeAll, describe, expect, it } from "bun:test";
import { readFileSync } from "fs";
import { solve } from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
});

describe(`Day ${__dirname} example`, () => {
  it("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBeUndefined();
  });

  it("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBeUndefined();
  });

  // Add more test cases if needed
});
