import chalk from "chalk";
import type { Coordinate } from "../06/solution";

export enum Quadrant {
  I = 0,
  II = 1,
  III = 2,
  IV = 3,
  NOWHERE = -1,
}

export type Robot = [position: Coordinate, vector: Coordinate];

export type State = {
  room: Coordinate;
  robots: Robot[];
  quadrants: Robot[][];
};
export const state: State = {
  room: [0, 0],
  robots: [],
  quadrants: [],
};

export const resetState = () => {
  state.room = [101, 103];
  state.robots.length = 0;
  state.quadrants.length = 0;
};

export const parseCoordinate = (val: string): Coordinate =>
  val.split("=")[1].split(",").map(Number) as Coordinate;

export const parseInput = (input: string): void => {
  resetState();
  const lines = input.split("\n").map((line) => line.trim());

  const { robots } = state;

  lines.forEach((line) => {
    if (line.length === 0) return;

    const [p, v] = line.split(" ");
    robots.push([parseCoordinate(p), parseCoordinate(v)]);
  });
};

export const getQuadrant = (robot: Robot): Quadrant => {
  const [xR, yR] = state.room;
  const [[xB, yB], _vB] = robot;

  const xRel = xB - Math.floor(xR / 2);
  const yRel = yB - Math.floor(yR / 2);

  // they're on  one of the "axis"
  if (xRel === 0 || yRel === 0) return Quadrant.NOWHERE;

  if (yRel > 0) {
    if (xRel > 0) return Quadrant.I;

    return Quadrant.II;
  }

  if (xRel < 0) return Quadrant.III;

  return Quadrant.IV;
};

export const moveRobot = (robot: Robot, seconds: number = 1): Quadrant => {
  const { room } = state;
  const [xRoom, yRoom] = room;

  const [[xS, yS], [xV, yV]] = robot;

  const xE = (((xS + seconds * xV) % xRoom) + xRoom) % xRoom;
  const yE = (((yS + seconds * yV) % yRoom) + yRoom) % yRoom;

  robot[0] = [xE, yE];

  return getQuadrant(robot);
};

export const moveRobots = (seconds: number = 1) => {
  const { robots, quadrants } = state;

  robots.forEach((robot) => {
    const quadrant = moveRobot(robot, seconds);

    // doesn't count
    if (quadrant === Quadrant.NOWHERE) return;

    // no robots at quadrant just yet
    if (!quadrants.at(quadrant)) quadrants[quadrant] = [];

    quadrants.at(quadrant)?.push(robot);
  });
};

export const getSafetyFactor = () => {
  const { quadrants } = state;

  const safetyFactor = quadrants.reduce((sf, robots) => sf * robots.length, 1);

  return safetyFactor;
};

export const coordToKey = ([x, y]: Coordinate): string => `${x},${y}`;

export const getInlineRobotPercentage = (): number => {
  const { robots } = state;
  const robotPositions = new Set<string>(
    robots.map(([position]) => coordToKey(position))
  );

  const offsets = [-1, 0, 1];
  const inlineRobotCount = robots.reduce((acc, [[x, y]]) => {
    let neighbourCount = 0;

    offsets.forEach((dX) => {
      offsets.forEach((dY) => {
        if (neighbourCount > 1) return;

        if (dX === 0 && dY === 0) return;

        if (robotPositions.has(coordToKey([x + dX, y + dY]))) neighbourCount++;
      });
    });

    if (neighbourCount === 2) return acc + 1;

    return acc;
  }, 0);

  return inlineRobotCount / robots.length;
};

export const moveRobotsInline = (
  maxMoves = 100,
  minPercentage = 0.1
): number => {
  let moves = 0;
  let bestPercentage = 0;
  let bestPercentageAfterMoves = 0;

  while (moves < maxMoves && bestPercentage < minPercentage) {
    moveRobots(1);
    moves++;

    const inlinePercentage = getInlineRobotPercentage();
    if (inlinePercentage <= bestPercentage) continue;

    bestPercentage = bestPercentage = inlinePercentage;
    bestPercentageAfterMoves = moves;
  }

  if (bestPercentage < minPercentage) return -1;

  return moves;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  moveRobots(100);

  /* --------------------------------- Part 1 --------------------------------- */

  const part1: number = getSafetyFactor();
  const part1fmt = chalk.underline.white(part1);
  let description = `The safety factor after 100 seconds is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  resetState();
  parseInput(input);

  const maxMoves = 10000;
  const easterEggPercentage = 0.5;

  const part2: number = moveRobotsInline(maxMoves, easterEggPercentage);
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and after ${part2fmt} seconds at least ${
    easterEggPercentage * 100
  }% of robots are inline and likely display the easter egg.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
