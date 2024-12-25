import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import {
  filePartChecksum,
  compactFileSystemChecksum,
  parseInput,
  resetState,
  solve,
  state,
  sumRange,
  defragFileSystemChecksum,
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

    const { fileSizes, freeSpaces, totalFileSize, totalFreeSpace } = state;

    expect(fileSizes).toEqual([1, 3, 5]);
    expect(freeSpaces).toEqual([2, 4]);

    expect(totalFileSize).toBe(9);
    expect(totalFreeSpace).toBe(6);
  });

  test("sumRange", () => {
    expect(sumRange(1, 2)).toBe(3);

    // 9 10 ... 16 17
    expect(sumRange(9, 9)).toBe(117);

    // 9 10 ... 25 26
    expect(sumRange(9, 18)).toBe(315);
  });

  test("filePartChecksum", () => {
    expect(filePartChecksum(0, 0, 9)).toBe(0);

    expect(filePartChecksum(1, 9, 9)).toBe(117);

    expect(filePartChecksum(2, 18, 9)).toBe(396);
  });

  test("compactFileSystemChecksum", () => {
    parseInput("12345");

    let checksum = compactFileSystemChecksum();

    // 0*0 + 1*(3+4+5) + 2*(1+2 + 6+7+8)
    expect(checksum).toBe(60);

    parseInput("90909");
    checksum = compactFileSystemChecksum();

    // 0*(0..8) + 1*(9..17) + 2*(18..26)
    expect(checksum).toBe(117 + 396);
  });

  test("defrag fileParthCecksums", () => {
    expect(filePartChecksum(1, 3, 1)).toBe(3);
  });

  test("defragFileSystemChecksum", () => {
    parseInput("321");

    let checksum = defragFileSystemChecksum();

    expect(checksum).toBe(3);
  });
});

describe(`Day ${__dirname} example`, () => {
  const { part1, part2 } = solve(exampleInput);

  test("Part 1 example", () => {
    expect(part1).toBe(1928);
  });

  test("Part 2 example", () => {
    expect(part2).toBe(2858);
  });

  // Add more test cases if needed
});
