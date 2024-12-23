import chalk from "chalk";
import { CoordinateSet, type Coordinate } from "../06/solution";

export type State = {
  map: Coordinate;
  antennas: Map<string, Coordinate[]>;
  antinodes: CoordinateSet;
};

export const state: State = {
  map: [-1, -1],
  antennas: new Map(),
  antinodes: new CoordinateSet(),
};

export const resetState = () => {
  state.map = [-1, -1];
  state.antennas.clear();
  state.antinodes.clear();
};

const parseInput = (input: string): void => {
  const lines = input.split("\n").map((line) => line.trim());

  state.map = [lines[0].length, lines.length];

  const { antennas } = state;

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const frequency = line[x];

      if (frequency === ".") continue;

      const coords =
        antennas.get(frequency) ?? antennas.set(frequency, []).get(frequency)!;
      coords.push([x, y]);
      antennas.set(frequency, coords);
    }
  }
};

const onMap = ([x, y]: Coordinate) => {
  const {
    map: [cols, rows],
  } = state;
  return x >= 0 && y >= 0 && x < cols && y < rows;
};

export const getAntinodes = (
  [xA, yA]: Coordinate,
  [xB, yB]: Coordinate
): Coordinate[] => {
  const antinodes: Coordinate[] = [
    [xA - (xB - xA), yA - (yB - yA)],
    [xB - (xA - xB), yB - (yA - yB)],
  ];

  return antinodes.filter((coord) => onMap(coord));
};

export const getResonantAntinodes = (
  [xA, yA]: Coordinate,
  [xB, yB]: Coordinate
): Coordinate[] => {
  const dX = xB - xA;
  const dY = yB - yA;

  const nodes: Coordinate[] = [];

  // increasing
  let node: Coordinate = [xA, yA];
  while (onMap(node)) {
    const [xN, yN] = node;
    nodes.push(node);
    node = [xN + dX, yN + dY];
  }

  // decreasing
  node = [xA - dX, yA - dY];
  while (onMap(node)) {
    const [xN, yN] = node;
    nodes.push(node);
    node = [xN - dX, yN - dY];
  }

  // sort them for better testing
  nodes.sort(([x1, y1], [x2, y2]) => {
    if (x1 === x2) return y1 - y2;

    return x1 - x2;
  });

  return nodes;
};

const calculateAntinodes = (resonantHarmonics = false) => {
  const { antennas, antinodes } = state;
  antennas.forEach((coords, frequency) => {
    const antennaCoords = [...coords];
    do {
      const [xA, yA] = antennaCoords.shift()!;

      antennaCoords.forEach(([xB, yB]) => {
        const newAntinodes = !resonantHarmonics
          ? getAntinodes([xA, yA], [xB, yB])
          : getResonantAntinodes([xA, yA], [xB, yB]);

        newAntinodes.forEach((coord) => antinodes.add(coord));
      });
    } while (antennaCoords.length > 0);
  });
};

console.log();

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  resetState();
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */

  calculateAntinodes();

  const {
    map: [cols, rows],
    antinodes,
  } = state;

  const part1: number = antinodes.size();
  const part1fmt = chalk.underline.white(part1);

  let description = `The map (${cols} x ${rows}) has ${part1fmt} unique locations containing antinodes`;

  /* --------------------------------- Part 2 --------------------------------- */

  const resonantHarmonics = true;
  calculateAntinodes(resonantHarmonics);

  const part2 = antinodes.size();
  const part2fmt = chalk.underline.yellow(part2);

  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  
  return { description, part1, part2 };
}
