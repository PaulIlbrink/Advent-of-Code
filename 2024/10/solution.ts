import chalk from "chalk";

export type Point = {
  x: number;
  y: number;
  height: number;
  inclining: Point[];
  declining: Point[];
  trails: number;
  tops: Set<Point>;
};
export type Island = [columns: number, rows: number];

export type State = {
  island: Island;
  points: Point[];
  matrix: Point[][];
};

export enum PointType {
  TOP = 9,
}
export type TrailInfo = {
  trailRating: number;
  trailScore: number;
  trailHeads: number;
};

export const state: State = {
  island: [0, 0],
  points: [],
  matrix: [],
};

export const resetState = () => {
  state.island = [0, 0];
  state.points.length = 0;
  state.matrix.length = 0;
};

export const parseInput = (input: string): void => {
  resetState();

  const lines = input.split("\n").map((line) => line.trim());

  const { points, matrix } = state;
  state.island = [lines[0].length, lines.length];

  let line;
  for (let y = 0; y < lines.length; y++) {
    line = lines[y].split("").map(Number);
    for (let x = 0; x < line.length; x++) {
      const height = Number(line[x]);
      const point = {
        x,
        y,
        height,
        inclining: [],
        declining: [],
        trails: 0,
        tops: new Set<Point>(),
      };

      // update trail possibilities and top's reachable
      if (height === PointType.TOP) {
        point.trails = 1;
        point.tops.add(point);
      }

      // store points in a matrix and an array
      if (!matrix[x]) matrix[x] = [];

      matrix[x][y] = point;
      points.push(point);
    }
  }

  // let's sort the points from high to low
  points.sort((a, b) => b.height - a.height);

  // link points to relevant points (1 lower or higher)
  points.forEach((point) => {
    const { x, y, height } = point;
    const adjacentPoints = [
      matrix.at(x)?.at(Math.max(y - 1, 0)),
      matrix.at(Math.max(x - 1, 0))?.at(y),
      matrix.at(x + 1)?.at(y),
      matrix.at(x)?.at(y + 1),
    ].filter((p) => p !== undefined);

    point.inclining.push(
      ...adjacentPoints.filter((p) => height + 1 === p.height)
    );
    point.declining.push(
      ...adjacentPoints.filter((p) => height - 1 === p.height)
    );
  });
};

export const calculateTrailInfo = (): TrailInfo => {
  const { points } = state;

  let trailScore = 0;
  let trailRating = 0;
  let trailHeads = 0;

  // distribute #trials and #tops downwards
  points.forEach(({ height, declining, trails, tops }) => {
    switch (height) {
      // update info
      case 0:
        trailRating += trails;
        trailScore += tops.size;
        trailHeads++;
        break;
      // increase the trail outcome for the lower adjacent points
      default:
        declining.forEach((point) => {
          point.trails += trails;
          tops.forEach((top) => point.tops.add(top));
        });
    }
  });

  return {
    trailRating,
    trailScore,
    trailHeads,
  };
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */

  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */

  const { island } = state;
  const [cols, rows] = island;

  const { trailScore, trailRating, trailHeads } = calculateTrailInfo();

  const part1: number = trailScore;
  const part1fmt = chalk.underline.white(part1);
  let description = `The island (${cols}x${rows}) has ${trailHeads} trailheads and their combines score is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */

  const part2: number = trailRating;
  const part2fmt = chalk.underline.yellow(part2);
  description += `, the combined rating of the ${trailHeads} trailheads is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
