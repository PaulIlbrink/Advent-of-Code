import { beforeAll, describe, expect, it, test } from "bun:test";
import { readFileSync } from "fs";
import {
  CoordinateSet,
  Direction,
  getNextDirection,
  getNextPosition,
  solve,
} from "./solution";
import type { Coordinate, State } from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
});

describe(`Day ${__dirname} example`, () => {
  test.skip("Coordinate Set", () => {
    const coord: Coordinate = [7, 8];
    const coordSet: CoordinateSet = new CoordinateSet();

    expect(coordSet.has(coord)).toBeFalse();

    coordSet.add(coord);

    expect(coordSet.has(coord)).toBeTrue();

    expect(coordSet.has([7, 8])).toBeTrue();

    const foo = [1, 4];
    const bar = [1, 4];
    expect(foo).toEqual([1, 4]);

    // const position: Position = [7, 8, Direction.N];
    // expect(coordSet.has(position)).toBeTrue();
  });

  test.skip("nextPosition", () => {
    // nextPosition
    expect(getNextPosition([5, 5, Direction.N])).toEqual([5, 4, Direction.N]);
    expect(getNextPosition([5, 5, Direction.E])).toEqual([6, 5, Direction.E]);
    expect(getNextPosition([5, 5, Direction.S])).toEqual([5, 6, Direction.S]);
    expect(getNextPosition([5, 5, Direction.W])).toEqual([4, 5, Direction.W]);
  });

  test.skip("nextDirection", () => {
    expect(getNextDirection(Direction.N)).toEqual(Direction.E);
    expect(getNextDirection(Direction.E)).toEqual(Direction.S);
    expect(getNextDirection(Direction.S)).toEqual(Direction.W);
    expect(getNextDirection(Direction.W)).toEqual(Direction.N);
  });

  it("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(6);
  });

  it("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(6);
    
    // actual input
    // expect(part2).not.toBe(1753); // my smart wrong result
    // expect(part2).toBe(1663); // correct result, brute forced
  });

  // Add more test cases if needed
});
