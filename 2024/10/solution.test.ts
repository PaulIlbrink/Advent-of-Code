import { beforeAll, describe, expect, it, test } from "bun:test";
import { readFileSync } from "fs";
import {
  calculateTrailInfo,
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

describe(`Day ${__dirname} state`, () => {
  test("matrix & points", () => {
    parseInput(exampleInput);

    const { matrix, points } = state;

    const a = matrix[1][0];
    const b = points[0];

    expect(a.height).toBe(9);
    expect(a.inclining).toHaveLength(0);

    expect(b.height).toBe(9);
    expect(b.inclining).toHaveLength(0);

    let aC = `${a.x} ${a.y}`;
    let bC = `${b.x} ${b.y}`;

    expect(aC).toBe("1 0");
    expect(bC).toBe("1 0");
  });

  test("tops", () => {
    parseInput(exampleInput);
    const score = calculateTrailInfo();

    const { matrix, points } = state;

    const c0 = matrix[6][4];
    const c1 = matrix[6][5];
    const c2 = matrix[7][5];
    const c3 = matrix[7][4]; // problems occurs, should have 3 tops, but has 6...
    const c4 = matrix[7][3];
    const c5 = matrix[7][2];
    const c6 = matrix[6][2];
    const c7 = matrix[6][1];
    const c8 = matrix[5][1];
    const c9 = matrix[5][2];

    expect(c3.x).toBe(7);
    expect(c3.y).toBe(4);
    expect(c3.inclining).toHaveLength(1);
    expect(c3.declining).toHaveLength(1);

    expect(c3.inclining).toContain(c4);
    expect(c3.declining).toContain(c2);

    const legitC4 = points.filter(({ declining }) => declining.includes(c3));
    expect(legitC4).toContain(c4);
    expect(legitC4).toHaveLength(1);

    const fakeC4 = matrix[0][4];
    expect(fakeC4.x).toBe(0);
    expect(fakeC4.y).toBe(4);
    expect(fakeC4.inclining).toHaveLength(1);
    expect(fakeC4.declining).toHaveLength(1);

    expect(c9.tops.size).toBe(1);
    expect(c8.tops.size).toBe(1);
    expect(c7.tops.size).toBe(1);
    expect(c6.tops.size).toBe(3);
    expect(c5.tops.size).toBe(3);
    expect(c4.tops.size).toBe(3);
    expect(c3.tops.size).toBe(3);
    expect(c2.tops.size).toBe(3);
    expect(c1.tops.size).toBe(3);
    expect(c0.tops.size).toBe(3);
  });
});

describe(`Day ${__dirname} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(36);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(81);
  });

  // Add more test cases if needed
});
