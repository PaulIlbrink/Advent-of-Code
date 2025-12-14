import { beforeAll, describe, expect, it, test } from "bun:test";
import { readFileSync } from "fs";
import {
  isColorRectangle,
  parseInput,
  resetState,
  solve,
  rectSize,
  state,
  setDirection,
  type Tile,
  rightTurns,
  isExtendable,
  getRelativeDirection,
} from "./solution";
import path, { resolve } from "path";
import { Direction } from "../../2024/06/solution";

let exampleInput: string;
const dayNumber = path.basename(__dirname);

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${dayNumber} functions`, () => {
  //#region Working function tests
  test("rightTurns", () => {
    let prevDir: Direction | undefined;

    expect(rightTurns(Direction.N, prevDir)).toBe(0);
    expect(rightTurns(Direction.E, prevDir)).toBe(0);
    expect(rightTurns(Direction.S, prevDir)).toBe(0);
    expect(rightTurns(Direction.W, prevDir)).toBe(0);

    prevDir = Direction.N;
    expect(rightTurns(Direction.N, prevDir)).toBe(0);
    expect(rightTurns(Direction.E, prevDir)).toBe(1);
    expect(rightTurns(Direction.S, prevDir)).toBe(2);
    expect(rightTurns(Direction.W, prevDir)).toBe(-1);

    prevDir = Direction.E;
    expect(rightTurns(Direction.N, prevDir)).toBe(-1);
    expect(rightTurns(Direction.E, prevDir)).toBe(0);
    expect(rightTurns(Direction.S, prevDir)).toBe(1);
    expect(rightTurns(Direction.W, prevDir)).toBe(2);

    prevDir = Direction.S;
    expect(rightTurns(Direction.N, prevDir)).toBe(2);
    expect(rightTurns(Direction.E, prevDir)).toBe(-1);
    expect(rightTurns(Direction.S, prevDir)).toBe(0);
    expect(rightTurns(Direction.W, prevDir)).toBe(1);

    prevDir = Direction.W;
    expect(rightTurns(Direction.N, prevDir)).toBe(1);
    expect(rightTurns(Direction.E, prevDir)).toBe(2);
    expect(rightTurns(Direction.S, prevDir)).toBe(-1);
    expect(rightTurns(Direction.W, prevDir)).toBe(0);
  });

  test("setDirection", () => {
    let tile: Tile = [5, 5];
    let tileNext: Tile = [5, 10];
    let tilePrev: Tile = [0, 5, Direction.E];

    let [_x, _y, tileDir] = tile;

    expect(tileDir).toBeUndefined();

    let rightTurns = setDirection(tile, tileNext);
    [_x, _y, tileDir] = tile;

    expect(tileDir).toBeDefined();
    expect(tileDir).toBe(Direction.N);
    expect(rightTurns).toBe(0);

    rightTurns = setDirection(tile, tileNext, tilePrev);
    expect(rightTurns).toBe(-1);
  });

  test("squareSize", () => {
    expect(rectSize([1, 1], [1, 1])).toBe(1);
    expect(rectSize([1, 1], [2, 2])).toBe(4);
    expect(rectSize([2, 2], [1, 1])).toBe(4);

    expect(rectSize([2, 2], [-2, -2])).toBe(25);

    expect(rectSize([2, 2], [22, 2])).toBe(21);
  });
  // #endregion

  test("getRelativeDirection", () => {
    expect(getRelativeDirection(Direction.N, Direction.N)).toBe(Direction.N);
  });

  test("isExtendable", () => {
    expect(isExtendable).toBeFunction();

    expect(state.clockWise).toBeFalse();

    expect(isExtendable(Direction.N, Direction.N)).toBeTrue();
    expect(isExtendable(Direction.E, Direction.E)).toBeTrue();
    expect(isExtendable(Direction.S, Direction.S)).toBeTrue();
    expect(isExtendable(Direction.W, Direction.W)).toBeTrue();

    // Direction.E
    expect(isExtendable(Direction.N, Direction.E)).toBeTrue();
    expect(isExtendable(Direction.E, Direction.S)).toBeTrue();
    expect(isExtendable(Direction.S, Direction.W)).toBeTrue();
    expect(isExtendable(Direction.W, Direction.N)).toBeTrue();

    // Direction.W
    expect(isExtendable(Direction.N, Direction.W)).toBeFalse();
    expect(isExtendable(Direction.W, Direction.S)).toBeFalse();
    expect(isExtendable(Direction.S, Direction.E)).toBeFalse();
    expect(isExtendable(Direction.E, Direction.N)).toBeFalse();

    // Direction.S
    expect(isExtendable(Direction.N, Direction.S)).toBeTrue();
    expect(isExtendable(Direction.E, Direction.W)).toBeTrue();
    expect(isExtendable(Direction.S, Direction.N)).toBeTrue();
    expect(isExtendable(Direction.W, Direction.E)).toBeTrue();

    state.clockWise = true;
    expect(state.clockWise).toBeTrue();

    // Direction.N
    expect(isExtendable(Direction.N, Direction.N)).toBeTrue();
    expect(isExtendable(Direction.E, Direction.E)).toBeTrue();
    expect(isExtendable(Direction.S, Direction.S)).toBeTrue();
    expect(isExtendable(Direction.W, Direction.W)).toBeTrue();

    // Direction.E
    expect(isExtendable(Direction.N, Direction.E)).toBeFalse();
    expect(isExtendable(Direction.E, Direction.S)).toBeFalse();
    expect(isExtendable(Direction.S, Direction.W)).toBeFalse();
    expect(isExtendable(Direction.W, Direction.N)).toBeFalse();

    // Direction.W
    expect(isExtendable(Direction.N, Direction.W)).toBeTrue();
    expect(isExtendable(Direction.W, Direction.S)).toBeTrue();
    expect(isExtendable(Direction.S, Direction.E)).toBeTrue();
    expect(isExtendable(Direction.E, Direction.N)).toBeTrue();

    // Direction.S
    expect(isExtendable(Direction.N, Direction.S)).toBeTrue();
    expect(isExtendable(Direction.E, Direction.W)).toBeTrue();
    expect(isExtendable(Direction.S, Direction.N)).toBeTrue();
    expect(isExtendable(Direction.W, Direction.E)).toBeTrue();
  });
  //#endregion

  test("isExtendable", () => {
    expect(isExtendable).toBeFunction();

    let { clockWise } = state;
    expect(clockWise).toBeFalse();

    expect(isExtendable(Direction.N, Direction.W)).toBeFalse();
    expect(isExtendable(Direction.N, Direction.E)).toBeTrue();
    expect(isExtendable(Direction.N, Direction.S)).toBeTrue();
    expect(isExtendable(Direction.N, Direction.N)).toBeTrue();

    expect(isExtendable(Direction.E, Direction.W)).toBeTrue();
    expect(isExtendable(Direction.E, Direction.E)).toBeTrue();
    expect(isExtendable(Direction.E, Direction.S)).toBeTrue();
    expect(isExtendable(Direction.E, Direction.N)).toBeFalse();

    expect(isExtendable(Direction.S, Direction.W)).toBeTrue();
    expect(isExtendable(Direction.S, Direction.E)).toBeFalse();
    expect(isExtendable(Direction.S, Direction.S)).toBeTrue();
    expect(isExtendable(Direction.S, Direction.N)).toBeTrue();

    expect(isExtendable(Direction.W, Direction.W)).toBeTrue();
    expect(isExtendable(Direction.W, Direction.E)).toBeTrue();
    expect(isExtendable(Direction.W, Direction.S)).toBeFalse();
    expect(isExtendable(Direction.W, Direction.N)).toBeTrue();

    state.clockWise = !clockWise;
    ({ clockWise } = state);
    expect(clockWise).toBeTrue();

    expect(isExtendable(Direction.N, Direction.W)).toBeTrue();
    expect(isExtendable(Direction.N, Direction.E)).toBeFalse();
    expect(isExtendable(Direction.N, Direction.S)).toBeTrue();
    expect(isExtendable(Direction.N, Direction.N)).toBeTrue();
  });
});

describe(`Day ${dayNumber} input`, () => {
  // #region Working input tests
  test("turnOffset", () => {
    resetState();

    let { turnOffset } = state;

    expect(turnOffset).toBe(0);

    parseInput(exampleInput);

    ({ turnOffset } = state);

    expect(turnOffset).toBe(-4);

    const rightPathInput = "0,0\n0,5\n5,5\n5,0";

    parseInput(rightPathInput);
    ({ turnOffset } = state);
    expect(turnOffset).toBe(4);

    const lineInput = "0,0\n10,0";
    parseInput(lineInput);
    ({ turnOffset } = state);
    expect(turnOffset).toBe(4);

    const altLineInput = "0,0\n-10,0";
    parseInput(altLineInput);
    ({ turnOffset } = state);
    expect(turnOffset).toBe(4);
  });

  test("redTiles", () => {
    parseInput(exampleInput);

    const { redTiles } = state;

    expect(redTiles).toBeArrayOfSize(8);

    const tileAt3 = redTiles.at(3);
    expect(tileAt3).toBeDefined();

    let [x, y, dir] = tileAt3!;
    expect([x, y]).toEqual([9, 7]);
    expect(dir).toBeDefined();
    expect(dir).toBe(Direction.S);
    expect([x, y, dir]).toEqual([9, 7, Direction.S]);

    [x, y, dir] = redTiles.at(0)!;
    expect([x, y]).toEqual([7, 1]);
    expect(dir).toBeDefined();
    expect(dir).toBe(Direction.E);

    [x, y, dir] = redTiles.at(1)!;
    expect([x, y]).toEqual([11, 1]);
    expect(dir).toBeDefined();
    expect(dir).toBe(Direction.N);

    [x, y, dir] = redTiles.at(2)!;
    expect([x, y]).toEqual([11, 7]);
    expect(dir).toBeDefined();
    expect(dir).toBe(Direction.W);

    [x, y, dir] = redTiles.at(7)!;
    expect([x, y]).toEqual([7, 3]);
    expect(dir).toBeDefined();
    expect(dir).toBe(Direction.S);

    expect(redTiles.at(99)).toBeUndefined();

    const missingDirections = redTiles.some(
      ([x, y, direction]) => direction === undefined
    );
    expect(missingDirections).toBeFalse();
  });
  // #endregion

  test.skip("edges", () => {
    parseInput(exampleInput);

    const { colEdges, rowEdges } = state;

    expect(colEdges).toBeEmpty();
    expect(rowEdges).toBeEmpty();

    parseInput(exampleInput);

    expect(colEdges).not.toBeEmpty();
    expect(rowEdges).not.toBeEmpty();

    expect(colEdges).toHaveLength(4);
    expect(rowEdges).toHaveLength(4);

    const colKeys = colEdges.keys();
    expect(new Set(colKeys)).toEqual(new Set([2, 7, 9, 11]));

    expect(colEdges.has(0)).toBeFalse();

    expect(colEdges.has(2)).toBeTrue();

    const colEdge2 = colEdges.get(2)!;
    expect(colEdge2).toBeArrayOfSize(1);
    expect(colEdge2.at(0)).toBeArray();
    // expect(colEdge2.at(0)).toEqual([5, 3]);
    expect(colEdge2.at(0)).not.toEqual([3, 5]);

    expect(colEdges.get(4)).toBeUndefined();

    const rowKeys = rowEdges.keys();
    expect(new Set(rowKeys)).toEqual(new Set([1, 3, 5, 7]));

    // expect(rowEdges).toHaveLength(4);
    // expect(rowEdges.has(0)).toBeFalse();

    // expect(rowEdges.has(1)).toBeTrue();
    // expect(rowEdges.get(1)?.at(0)).toEqual([7, 11]);
    // expect(rowEdges.get(1)?.at(0)).not.toEqual([11, 7]);

    // expect(rowEdges.get(3)?.at(0)).toEqual([2, 7]);
    // expect(rowEdges.get(3)?.at(0)).not.toEqual([7, 2]);

    // expect(rowEdges.get(4)).toBeUndefined();
  });

  describe("input based functions", () => {
    test("isFullColor", () => {
      parseInput(exampleInput);

      expect(isColorRectangle([1, 1], [1, 1])).toBeTrue();
    });
  });
});

describe(`Day ${dayNumber} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(50);
  });

  test.skip("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(24);
  });
});
