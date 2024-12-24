import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import {
  filePartChecksum,
  fileSystemChecksum,
  parseInput,
  resetState,
  solve,
  state,
  sumRange,
} from "./solution";
import { resolve } from "path";

let exampleInput: string;

beforeAll(() => {
  exampleInput = readFileSync(resolve(__dirname, "input.example.txt"), "utf-8");
  resetState();
});

describe(`Day ${__dirname} functions`, () => {
  test("parseInput", () => {
    parseInput("12345");

    const { fileSizes, freeSpaces, total } = state;

    expect(fileSizes).toEqual([1, 3, 5]);
    expect(freeSpaces).toEqual([2, 4]);

    expect(total).toEqual([9, 6]);

    const [file, free] = total;
    expect(file).toBe(9);
    expect(free).toBe(6);
  });

  test.skip("sumRange", () => {
    expect(sumRange(1, 2)).toBe(3);

    // 9 10 ... 16 17
    expect(sumRange(9, 9)).toBe(117);

    // 9 10 ... 25 26
    expect(sumRange(9, 18)).toBe(315);

    expect(sumRange(9, 18)).toBe(315);
  });

  test.skip("filePartChecksum", () => {
    expect(filePartChecksum(0, 0, 9)).toBe(0);

    expect(filePartChecksum(1, 9, 9)).toBe(117);

    expect(filePartChecksum(2, 18, 9)).toBe(396);

    expect(filePartChecksum(2, 1, 0)).toBe(0);
  });

  test("fileSystemChecksum", () => {
    parseInput("12345");

    let checksum = fileSystemChecksum();

    // 0*0 + 1*(3+4+5) + 2*(1+2 + 6+7+8)
    expect(checksum).toBe(60);

    parseInput("90909");
    checksum = fileSystemChecksum();

    // 0*(0..8) + 1*(9..17) + 2*(18..26)
    expect(checksum).toBe(60);
  });
});

describe(`Day ${__dirname} example`, () => {
  test.skip("Part 1 example", () => {
    const { part1 } = solve(exampleInput);

    expect(part1).toBe(1928);
  });

  test.skip("Part 2 example", () => {
    const { part2 } = solve(exampleInput);

    expect(part2).toBe(0);
  });

  // Add more test cases if needed
});
