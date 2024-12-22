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
  TRIED_BEFORE = 3,
}

export class CoordinateSet {
  private set: Set<string>;

  private toKey(coord: Coordinate): string {
    return `${coord[0]},${coord[1]}`;
  }

  private fromKey(key: string): Coordinate {
    const [x, y] = key.split(",").map(Number);
    return [x, y];
  }

  constructor(internal: Set<string> = new Set<string>()) {
    this.set = internal;
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

  values(): Coordinate[] {
    return Array.from(this.set, this.fromKey);
  }
  clonePrivateSet(): Set<string> {
    return new Set(this.set.values());
  }
}

export class PositionSet {
  private set: Set<string>;

  private toKey(pos: Position): string {
    return `${pos[0]},${pos[1]},${pos[2]}`;
  }

  private fromKey(key: string): Position {
    const [x, y, direction] = key.split(",").map(Number);
    return [x, y, direction];
  }
  constructor(privateSet: Set<string> = new Set()) {
    this.set = privateSet;
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

  values(): Position[] {
    return Array.from(this.set, this.fromKey);
  }
  clonePrivateSet(): Set<string> {
    return new Set(this.set);
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

const resetState = () => {
  state.obstacles.clear();
  state.loopHoles.clear();
  state.guard.position = [-1, -1, Direction.N];
  state.guard.positionHistory.clear();
  state.guard.coordinateHistory.clear();
  state.lab = [0, 0];
};

const parseInput = (input: string): void => {
  const lines = input.split("\n").map((line) => line.trim());
  if (!lines.length) return;

  const { guard, obstacles } = state;

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

export const getPositionType = (
  [x, y, _]: Position,
  block?: Coordinate
): PositionType => {
  const { obstacles, lab } = state;
  const [columns, rows] = lab;

  if (block) {
    const [xB, yB] = block;
    if (x == xB && y == yB) return PositionType.BLOCKED;
  }

  if (obstacles.has([x, y])) return PositionType.BLOCKED;

  if (x < 0 || y < 0 || x >= columns || y >= rows)
    return PositionType.OUTSIDE_MAP;

  return PositionType.AVAILABLE;
};

const scoutPatrol = (blockPosition: Position): PatrolResult => {
  const [x, y, _] = blockPosition;
  const blockCoord: Coordinate = [x, y];

  const { guard, loopHoles } = state;
  const { coordinateHistory } = guard;

  if (coordinateHistory.has([x, y])) return PatrolResult.TRIED_BEFORE;

  const scout: Guard = {
    position: [...guard.position],
    positionHistory: new PositionSet(guard.positionHistory.clonePrivateSet()),
    coordinateHistory: new CoordinateSet(), // no need to clone this
  };

  const scoutReport = patrol(scout, blockCoord);

  // YES!!! we found a loophole
  if (scoutReport === PatrolResult.LOOP) {
    loopHoles.add(blockCoord);
  }

  return scoutReport;
};

const patrol = (guard: Guard, block?: Coordinate): PatrolResult => {
  let nextPosition: Position;

  do {
    const { position, positionHistory, coordinateHistory } = guard;

    nextPosition = getNextPosition(position);

    // Loop found
    if (positionHistory.has(nextPosition)) return PatrolResult.LOOP;

    const nextType = getPositionType(nextPosition, block);

    const [x, y, direction] = position;

    // Blocked so rotate right
    if (nextType === PositionType.BLOCKED) {
      nextPosition = [x, y, getNextDirection(direction)];
    }

    // Going straight, but also opportunity to block
    if (nextType === PositionType.AVAILABLE && !block) {
      scoutPatrol(nextPosition);
    }

    // mutate position and coordinate history
    positionHistory.add(position);
    coordinateHistory.add([x, y]);

    guard.position = nextPosition;
  } while (getPositionType(guard.position) !== PositionType.OUTSIDE_MAP);

  return PatrolResult.FINISHED;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  resetState();
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const { guard } = state;

  const { position: guardStartPosition } = guard;
  patrol(guard);

  const {
    obstacles,
    lab,
    guard: { coordinateHistory },
    loopHoles,
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

  const [x, y, _] = guardStartPosition;

  const loopableCoordinates = loopHoles.size();

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
