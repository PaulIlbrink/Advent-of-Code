import chalk from "chalk";

export enum Direction {
  N = 1,
  E = 2,
  S = 3,
  W = 4,
}

export enum PositionType {
  AVAILABLE = 1,
  BLOCKED = 2,
  OUTSIDE_MAP = 3,
}

export enum PatrolResult {
  FINISHED = 1,
  LOOP = 2,
}

export class CoordinateSet {
  private set = new Set<string>();

  private toKey(coord: Coordinate): string {
    return `${coord[0]},${coord[1]}`;
  }

  has(coord: Coordinate): boolean {
    return this.set.has(this.toKey(coord));
  }

  add(coord: Coordinate): void {
    this.set.add(this.toKey(coord));
  }

  delete(coord: Coordinate): boolean {
    return this.set.delete(this.toKey(coord));
  }

  clear(): void {
    this.set.clear();
  }

  size(): number {
    return this.set.size;
  }
}

export class PositionSet {
  private set = new Set<string>();

  private toKey(pos: Position): string {
    return `${pos[0]},${pos[1]},${pos[2]}`;
  }

  has(pos: Position): boolean {
    return this.set.has(this.toKey(pos));
  }

  add(pos: Position): void {
    this.set.add(this.toKey(pos));
  }

  delete(pos: Position): boolean {
    return this.set.delete(this.toKey(pos));
  }

  clear(): void {
    this.set.clear();
  }

  size(): number {
    return this.set.size;
  }
}

export type Coordinate = [number, number];
export type Position = [number, number, Direction];

export type State = {
  obstacles: CoordinateSet;
  loopHoles: CoordinateSet;
  lab: Coordinate;
  guard: Guard;
  scout?: Guard;
};
export type Guard = {
  position: Position;
  positionHistory: PositionSet;
  coordinateHistory: CoordinateSet;
};

const state: State = {
  obstacles: new CoordinateSet(),
  loopHoles: new CoordinateSet(),
  lab: [0, 0],
  guard: {
    position: [-1, -1, Direction.N],
    positionHistory: new PositionSet(),
    coordinateHistory: new CoordinateSet(),
  },
};

const parseInput = (input: string): void => {
  const lines = input.split("\n").map((line) => line.trim());
  if (!lines.length) return;

  const { obstacles, lab, guard } = state;

  // Clear state
  obstacles.clear();
  state.lab = [lines[0].length, lines.length];

  // repopulate the state again
  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      const char = line.charAt(x);

      // nothing
      if (char === ".") continue;

      // guard
      if (char === "^") {
        guard.position = [x, y, Direction.N];
        continue;
      }

      // obstacles
      obstacles.add([x, y]);
    }
  });
};

export const getNextDirection = (direction: Direction) => (direction % 4) + 1;

export const getNextPosition = ([x, y, direction]: Position): Position => {
  switch (direction) {
    case Direction.E:
    case Direction.W:
      return [x - direction + 3, y, direction];
    case Direction.N:
    case Direction.S:
    default:
      return [x, y + direction - 2, direction];
  }
};

export const getPositionType = ([x, y, _]: Position): PositionType => {
  const { obstacles, lab } = state;
  const [columns, rows] = lab;

  if (obstacles.has([x, y])) return PositionType.BLOCKED;

  if (x < 0 || y < 0 || x >= columns || y >= rows)
    return PositionType.OUTSIDE_MAP;

  return PositionType.AVAILABLE;
};

const patrol = (guard: Guard): PatrolResult => {
  let nextPosition: Position;
  do {
    const { position, positionHistory, coordinateHistory } = guard;

    nextPosition = getNextPosition(position);

    // Loop found
    if (positionHistory.has(nextPosition)) return PatrolResult.LOOP;

    const nextType = getPositionType(nextPosition);

    // Blocked so rotate right
    if (nextType === PositionType.BLOCKED) {
      const [x, y, direction] = position;
      nextPosition = [x, y, getNextDirection(direction)];
    }

    // mutate position and position history
    positionHistory.add(position);
    coordinateHistory.add(position);
    guard.position = nextPosition;
  } while (getPositionType(guard.position) !== PositionType.OUTSIDE_MAP);

  return PatrolResult.FINISHED;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const { guard } = state;
  patrol(guard);

  const {
    obstacles,
    lab,
    guard: { coordinateHistory },
  } = state;

  const [columns, rows] = lab;

  const totalPositions = columns * rows;
  const nonBlockedPositions = totalPositions - obstacles.size();
  const visitedPositions = coordinateHistory.size();

  let description = `The guard patrolling the lab (${columns}x${rows} = ${totalPositions}) has visited ${chalk.underline.white(
    visitedPositions ?? "??"
  )} out of ${nonBlockedPositions} possible positions (${Math.round(
    (100 * visitedPositions) / nonBlockedPositions
  )}%)`;

  /* --------------------------------- Part 2 --------------------------------- */

  const loopableCoordinates = -1; // loopHoles?.size

  description += `, and there are ${chalk.underline.yellow(
    loopableCoordinates
  )} posibilities which can trap the guard in a loop.`;

  return {
    description,
    part1: visitedPositions,
    part2: loopableCoordinates,
    debug: { state, guard },
  };
}
