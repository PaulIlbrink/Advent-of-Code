import chalk from "chalk";
import { connect } from "http2";

export type Coordinate3D = [x: number, y: number, z: number];
type JunctionDistance = {
  distance: number;
  boxA: JunctionBox;
  boxB: JunctionBox;
};
export type JunctionBox = {
  position: Coordinate3D;
};
export type Circuit = Set<JunctionBox>;

export type State = {
  boxes: JunctionBox[];
  distances: JunctionDistance[];
  circuits: Set<Circuit>;
  connectedBoxes: Set<JunctionBox>;
};
export const state: State = {
  boxes: [],
  distances: [],
  circuits: new Set<Circuit>(),
  connectedBoxes: new Set<JunctionBox>(),
};

export const resetState = (soft = false) => {
  if (!soft) {
    state.boxes.length = 0;
    state.distances.length = 0;
  }

  state.circuits.clear();
  state.connectedBoxes.clear();
};

export const parseInput = (input: string): void => {
  resetState();

  const lines = input.split("\n").map((line) => line.trim());

  const { boxes, distances } = state;

  lines.forEach((line) => {
    const numbers = line.split(",").map(Number);
    if (numbers.length !== 3) return;

    const [x, y, z] = numbers;
    const newBox: JunctionBox = { position: [x, y, z] };

    boxes.forEach((box) => {
      distances.push({
        distance: calcDistance(box.position, newBox.position),
        boxA: box,
        boxB: newBox,
      });
    });

    boxes.push(newBox);
  });

  distances.sort(({ distance: distanceA }, { distance: distanceB }) => {
    return distanceA - distanceB;
  });
};

export const calcDistance = (
  [xA, yA, zA]: Coordinate3D,
  [xB, yB, zB]: Coordinate3D
) => {
  const dA = xA - xB;
  const dY = yA - yB;
  const dZ = zA - zB;

  return Math.sqrt(dA * dA + dY * dY + dZ * dZ);
};

export const sumTo = (n: number) => {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
};

export const isOneBigCircuit = () => {
  const { boxes, connectedBoxes, circuits } = state;

  return connectedBoxes.size === boxes.length && circuits.size === 1;
};

export const connectCircuits = (max: number = 0): JunctionDistance | false => {
  const { distances, circuits, connectedBoxes } = state;

  const maxConnections = max
    ? Math.min(distances.length, max)
    : distances.length;

  let distance;
  for (let i = 0; i < maxConnections; i++) {
    distance = distances[i];
    const { boxA, boxB } = distance;

    const existingCircuits = circuits
      .values()
      .toArray()
      .filter((circuit) => circuit.has(boxA) || circuit.has(boxB));

    if (!existingCircuits.length) {
      circuits.add(new Set([boxA, boxB]));
      connectedBoxes.add(boxA);
      connectedBoxes.add(boxB);
      continue;
    }

    if (existingCircuits.length === 2) {
      let [circA, circB] = existingCircuits;
      circB.values().forEach((box) => circA.add(box));

      circuits.delete(circB);

      if (isOneBigCircuit()) return distance;

      continue;
    }

    const [existing] = existingCircuits;
    if (!existing.has(boxA)) {
      existing.add(boxA);
      connectedBoxes.add(boxA);

      if (isOneBigCircuit()) return distance;

      continue;
    }

    existing.add(boxB);
    connectedBoxes.add(boxB);

    if (isOneBigCircuit()) return distance;
  }

  return false;
};

export const totalCircuitSize = (max = 3): number => {
  const { circuits } = state;
  const circArr = circuits.values().toArray();
  circArr.sort((a, b) => b.size - a.size);

  let total = circArr.slice(0, max).reduce((t, c) => t * c.size, 1);

  return total;
};

export function solve(input: string, maxConnections = 1000): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  connectCircuits(maxConnections);

  const firstN = 3;

  const part1: number = totalCircuitSize(firstN);
  const part1fmt = chalk.underline.white(part1);
  let description = `After making ${maxConnections} connections the product of the ${firstN} largest circuits is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  resetState(true);

  const success = connectCircuits();

  let part2 = 0;
  if (success) {
    const { boxA, boxB } = success;
    const [xA] = boxA.position;
    const [xB] = boxB.position;
    part2 = xA * xB;
  }

  const part2fmt = chalk.underline.yellow(part2);
  description += `, the product of the X-coordinates of the connection that connects all boxes in one big single circuit is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
