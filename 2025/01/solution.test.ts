import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resetState, solve, turn, state } from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${__dirname} functions`, () => {
  test("turn", () => {
    let testMove = turn(15);
    expect(testMove).toBeInteger();
    expect(testMove).toBe(0);

    // includePasses = false;
    expect(turn(65)).toBe(0);

    resetState();
    state.includePasses = true;
    expect(turn(65)).toBe(1);

    resetState();
    state.includePasses = true;
    expect(turn(350)).toBe(4);

    resetState();
    state.includePasses = true;
    turn(-50);
    expect(state.position).toBe(0);

    expect(turn(-599)).toBe(5);
    expect(state.position).toBe(1);
  });
});

describe(`Day ${__dirname} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(3);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(6);
  });

  // Add more test cases if needed
});
