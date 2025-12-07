import chalk from "chalk";

export enum Part {
  NOTHING = 0,
  BEAM = 1,
  SPLITTER = 2,
  INACTIVE_SPLITTER = 3,
}

export type Position = {
  part: Part;
  timeLines: number;
};

export type State = {
  map: Position[][];
};
export const state: State = {
  map: [],
};

export const resetState = () => {
  state.map.length = 0;
};
export const splitBeams = (): number => {
  const { map } = state;

  if (map.length < 2) return 0;

  let totalSplits = 0;
  let abovePos, pos, adj: Position;
  let row: Position[];
  for (let y = 1; y < map.length; y++) {
    row = map[y];
    for (let x = 0; x < row.length; x++) {
      abovePos = map[y - 1][x];

      if (abovePos.part !== Part.BEAM) continue;

      pos = row[x];

      if ([Part.BEAM, Part.NOTHING].includes(pos.part)) {
        pos.part = Part.BEAM;
        pos.timeLines += abovePos.timeLines;
        continue;
      }

      // splitter
      totalSplits++;

      if (x > 0) {
        adj = map[y][x - 1];
        adj.part = Part.BEAM;
        adj.timeLines += abovePos.timeLines;
      }

      if (x < row.length - 1) {
        adj = map[y][x + 1];
        adj.part = Part.BEAM;
        adj.timeLines += abovePos.timeLines;
      }
    }
  }

  return totalSplits;
};

export const countTimelines = () => {
  const { map } = state;

  if (!map.length) return 0;

  const lastRow = map[map.length - 1];

  return lastRow.reduce(
    (timelines, { timeLines: beamsize }) => timelines + beamsize,
    0
  );
};

export const parseInput = (input: string): void => {
  resetState();
  const lines = input.split("\n").map((line) => line.trim());

  const { map } = state;

  let linePositions: Position[];
  let linePos: Position;
  lines.forEach((line, y) => {
    linePositions = [];

    for (let x = 0; x < line.length; x++) {
      linePos = {
        part: Part.NOTHING,
        timeLines: 0,
      };

      switch (line.charAt(x)) {
        case ".":
          break;
        case "^":
          linePos.part = Part.SPLITTER;
          break;
        case "S":
          linePos.part = Part.BEAM;
          linePos.timeLines = 1;
          break;
      }

      linePositions.push(linePos);
    }

    map.push(linePositions);
  });
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = splitBeams();
  const part1fmt = chalk.underline.white(part1);
  let description = `The tachyon beam will be split ${part1fmt} times`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = countTimelines();
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and a tachyon particle can end up on ${part2fmt} different timelines.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
