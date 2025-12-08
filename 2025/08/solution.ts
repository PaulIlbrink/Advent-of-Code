import chalk from "chalk";
import { getJSDocThisTag } from "typescript";

export type Coordinate3D = [x: number, y: number, z: number];
type JunctionDistance = {
  distance: number;
  boxA: JunctionBox;
  boxB: JunctionBox;
};
export type JunctionBox = Coordinate3D;

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

  const DISTANCE_THRESHOLD = // 0.01% of the max
    0.000_1 * calcDistance([0, 0, 0], [999_999, 999_999, 999_999]);

  let skipped = 0;
  for (const line of lines) {
    const numbers = line.split(",").map(Number);
    if (numbers.length !== 3) return;

    const [x, y, z] = numbers;
    const newBox: JunctionBox = [x, y, z];

    for (const box of boxes) {
      const distance = calcDistance(box, newBox);
      if (distance < DISTANCE_THRESHOLD) {
        distances.push({
          distance,
          boxA: box,
          boxB: newBox,
        });
      } else {
        skipped++;
      }
    }

    boxes.push(newBox);
  }

  distances.sort(
    ({ distance: distanceA }, { distance: distanceB }) => distanceA - distanceB
  );
};

export const calcDistance = (
  [xA, yA, zA]: Coordinate3D,
  [xB, yB, zB]: Coordinate3D
) => {
  const dA = xA - xB;
  const dY = yA - yB;
  const dZ = zA - zB;

  return dA * dA + dY * dY + dZ * dZ;
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

  return circuits.size === 1 && connectedBoxes.size === boxes.length;
};

export const connectCircuits = (
  max = 0,
  startAt = 0
): JunctionDistance | false => {
  const { distances, circuits, connectedBoxes } = state;

  const maxConnections = max
    ? Math.min(distances.length, max)
    : distances.length;

  let distance;
  for (let i = startAt; i < maxConnections; i++) {
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
      for (const circ of circB.values()) {
        circA.add(circ);
      }

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

  const success = connectCircuits(0);

  let part2 = 0;
  if (success) {
    const { boxA, boxB } = success;
    const [xA] = boxA;
    const [xB] = boxB;
    part2 = xA * xB;
  }

  const part2fmt = chalk.underline.yellow(part2);
  description += `, the product of the X-coordinates of the connection that connects all boxes in one big single circuit is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
