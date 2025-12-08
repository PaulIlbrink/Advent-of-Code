import chalk from "chalk";

export type Coordinate3D = [x: number, y: number, z: number];
type JunctionDistance = {
  distance: number;
  boxA: JunctionBox;
  boxB: JunctionBox;
};
export type JunctionBox = {
  position: Coordinate3D;
};
export type Circuit = JunctionBox[];

export type State = {
  boxes: JunctionBox[];
  distances: JunctionDistance[];
  circuits: Circuit[];
};
export const state: State = { boxes: [], distances: [], circuits: [] };

export const resetState = () => {
  state.boxes.length = 0;
  state.distances.length = 0;
  state.circuits.length = 0;
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

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = 0; // not solved yet
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
