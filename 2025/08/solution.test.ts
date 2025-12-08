import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import {
  calcDistance,
  parseInput,
  resetState,
  solve,
  state,
  sumTo,
  type Coordinate3D,
} from "./solution";
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
    const { boxes, distances, circuits } = state;

    expect(boxes).toBeArrayOfSize(20);
    expect(boxes[1]).toEqual({ position: [57, 618, 57] });

    expect(distances).toHaveLength(sumTo(boxes.length - 1));
    expect(distances[0].distance).toBeLessThanOrEqual(distances[19].distance);

    expect(circuits).toHaveLength(0);
  });

  test("softReset", () => {
    const { connectedBoxes, circuits, boxes, distances } = state;

    expect(circuits.size).toBe(0);
    expect(connectedBoxes.size).toBeGreaterThanOrEqual(0);

    solve(exampleInput, 1);

    expect(circuits.size).toBe(1);
    expect(connectedBoxes.size).toBeGreaterThanOrEqual(2);

    resetState(true);
    expect(circuits.size).toBe(0);
    expect(connectedBoxes.size).toBeGreaterThanOrEqual(0);
    expect(boxes).toBeArrayOfSize(20);
    expect(distances).toHaveLength(sumTo(boxes.length - 1));
  });
});

describe(`Day ${dayNumber} functions`, () => {
  test("calcDistance", () => {
    const a: Coordinate3D = [2, 3, 5];
    const b: Coordinate3D = [7, 1, 9];

    const dAB = calcDistance(a, b);

    expect(Math.round(dAB * 100) / 100).toBe(6.71);
  });
});

describe(`Day ${dayNumber} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput, 10);

    expect(part1).toBe(40);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput, 0);

    expect(part2).toBe(25272);
  });
});
