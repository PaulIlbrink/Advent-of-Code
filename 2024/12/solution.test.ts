import { beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import {
  ALL_DIRECTIONS,
  Dir,
  parseInput,
  populateMatrix,
  resetState,
  solve,
  state,
  updateAdjacentAndFences,
  type Plot,
} from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeEach(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
});

describe(`Day ${__dirname} functions`, () => {
  test("ALL_DIRECTIONS", () => {
    expect(ALL_DIRECTIONS).toEqual([Dir.N, Dir.E, Dir.S, Dir.W]);
  });

  test("populateMatrix", () => {
    populateMatrix(exampleInput);

    const { matrix, plots } = state;

    expect(matrix).toHaveLength(10);
    expect(matrix.at(7)).toBeArray();
    expect(matrix.at(7)).toHaveLength(10);

    expect(matrix.at(10)).toBeUndefined();
    expect(matrix.at(0)?.at(0)).toEqual({
      x: 0,
      y: 0,
      plant: "R",
      adjacent: [],
      fenceDirections: [],
      regionIdx: -1,
    });
    expect(matrix.at(7)?.at(5)).toEqual({
      x: 7,
      y: 5,
      plant: "J",
      adjacent: [],
      fenceDirections: [],
      regionIdx: -1,
    });

    expect(plots).toHaveLength(100);
    expect(matrix.at(0)?.at(0)).toBe(plots[0]);
  });

  test("updateAdjacentAndFences", () => {
    resetState();
    populateMatrix(exampleInput);
    updateAdjacentAndFences();

    const { matrix } = state;

    expect(matrix).toHaveLength(10);

    let plot: Plot = matrix[0][0];
    expect(plot.plant).toBe("R");
    expect(plot.fenceDirections).toContainValues([Dir.N, Dir.W]);
    expect(plot.fenceDirections).toHaveLength(2);

    plot = matrix[1][0];
    expect(plot.plant).toBe("R");
    expect(plot.adjacent).toHaveLength(4);

    expect(plot.adjacent[Dir.N]).toBeUndefined();
    expect(plot.adjacent[Dir.E]).not.toBeUndefined();
    expect(plot.adjacent[Dir.S]).not.toBeUndefined();
    expect(plot.adjacent[Dir.W]).not.toBeUndefined();

    expect(plot.adjacent[Dir.E]?.plant).toBe(plot.plant);
    expect(plot.adjacent[Dir.S]?.plant).toBe(plot.plant);
    expect(plot.adjacent[Dir.W]?.plant).toBe(plot.plant);

    expect(plot.fenceDirections).toHaveLength(1);

    plot = matrix[2][4];
    expect(plot.plant).toBe("V");
    expect(plot.fenceDirections).toHaveLength(2);
  });

  test("updateRegions", () => {
    parseInput(exampleInput);

    const { matrix, regions } = state;

    expect(matrix[0][0].plant).toBe("R");
    expect(matrix[0][3].regionIdx).toBe(0);
    expect(matrix[1][3].regionIdx).toBe(0);
    expect(matrix[2][4].regionIdx).toBe(0);
    expect(matrix[3][2].regionIdx).toBe(0);
    expect(regions.size).toBe(9);

    expect(regions.has("C")).toBeTrue();

    let regionArr = regions.get("C")!;

    expect(regionArr.filter((r) => r.size > 0)).toHaveLength(2);
    expect(regionArr[0].size).toBe(14);
  });
});

describe(`Day ${__dirname} simple example`, () => {
  beforeEach(() => {
    exampleInput = readFileSync(
      resolve(__dirname, "input.example.simple.txt"),
      "utf-8"
    );
    parseInput(exampleInput);
  });

  test("Regions", () => {
    expect(exampleInput).toStartWith("AA");

    const { matrix, regions } = state;

    expect(matrix[0][0].plant).toBe("A");
    expect(regions.size).toBe(5);

    expect(regions.keys().toArray()).toEqual(["A", "B", "C", "D", "E"]);
  });

  test("solve", () => {
    const { part1, part2 } = solve(exampleInput);

    expect(part1).toBe(140);
  });
});

describe(`Day ${__dirname} enclave example`, () => {
  beforeEach(() => {
    exampleInput = readFileSync(
      resolve(__dirname, "input.example.enclave.txt"),
      "utf-8"
    );
  });

  test("parseInput", () => {
    parseInput(exampleInput);
    const { regions } = state;

    expect(regions.size).toBe(2);
    expect(regions.get("O")).toHaveLength(1);
    expect(regions.get("X")).toHaveLength(4);
  });

  test("solve", () => {
    const { part1, part2 } = solve(exampleInput);
    expect(part1).toBe(772);
  });
});

describe(`Day ${__dirname} example`, () => {
  test("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    const { regions, plots } = state;

    expect(plots).toHaveLength(100);

    expect(regions.size).toBe(9);
    expect(regions.get("R")).toBeDefined();
    expect(regions.get("R")).toHaveLength(1);

    expect(part1).toBe(1930);
  });

  test("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(1206);
  });

  // Add more test cases if needed
});
