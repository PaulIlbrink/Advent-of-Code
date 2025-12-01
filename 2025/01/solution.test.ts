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
    let [position, zeros] = turn(50, 25);
    expect(position).toBe(75);
    expect(zeros).toBe(0);

    [position, zeros] = turn(50, -68);
    expect(position).toBe(82);
    expect(zeros).toBe(1);

    [position, zeros] = turn(50, -385);
    expect(position).toBe(65);
    expect(zeros).toBe(4);

    [position, zeros] = turn(50, -50);
    expect(position).toBe(0);
    expect(zeros).toBe(1);

    [position, zeros] = turn(50, 50);
    expect(position).toBe(0);
    expect(zeros).toBe(1);

    [position, zeros] = turn(50, -375);
    expect(position).toBe(75);
    expect(zeros).toBe(4);

    [position, zeros] = turn(50, 375);
    expect(position).toBe(25);
    expect(zeros).toBe(4);

    [position, zeros] = turn(50, 325);
    expect(position).toBe(75);
    expect(zeros).toBe(3);

    [position, zeros] = turn(0, -5);
    expect(position).toBe(95);
    expect(zeros).toBe(0);
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
});
