import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { parseInput, resetState, solve } from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${__dirname} functions`, () => {
  test("parseInput", () => {
    expect(() => parseInput(exampleInput)).not.toThrowError();

    expect(() => parseInput("foo bar")).toThrowError(/^Missing input/);

    expect(() => parseInput("foo\nbar\nlorem\nipsum")).toThrowError(
      /^Invalid input/
    );

    const incompleteInput = exampleInput.split("\n").slice(0, 5).join("\n");
    expect(exampleInput).toStartWith(incompleteInput);
    expect(exampleInput).not.toEqual(incompleteInput);

    expect(() => parseInput(incompleteInput)).toThrowError(/^Incomplete input/); // doesn't work
  });
});

describe(`Day ${__dirname} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(480);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(875318608908);
  });

  // Add more test cases if needed
});
