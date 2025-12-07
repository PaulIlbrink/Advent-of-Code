import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { parseInput, Part, resetState, solve, state } from "./solution";
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
    const { map } = state;

    expect(map).toBeArrayOfSize(16);

    const firstRow = map[0];
    expect(firstRow).toBeArrayOfSize(15);

    expect(firstRow[0].part).toBe(Part.NOTHING);

    expect(firstRow.filter(({ part }) => part === Part.BEAM)).toBeArrayOfSize(
      1
    );

    expect(firstRow[7].part).toBe(Part.BEAM);
  });
});

describe.skip(`Day ${dayNumber} functions`, () => {
  test("some day specific function", () => {
    const foo = null;

    expect(foo).toBeTrue();
  });
});

describe(`Day ${dayNumber} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(21);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(40);
  });
});
