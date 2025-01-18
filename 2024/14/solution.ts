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

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  moveRobots(100);

  /* --------------------------------- Part 1 --------------------------------- */

  const part1: number = getSafetyFactor();
  const part1fmt = chalk.underline.white(part1);
  let description = `The safetyfactor after 100 seconds is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
