import chalk from "chalk";

enum Direction {
  N = 0,
  E = 1,
  S = 2,
  W = 3,
}

type Coordinate = [x: number, y: number];
type ObstacleAxisMap = Map<number, Set<Number>>;
type ObstacleReport = {
  coordinates: CoordinateSet;
  xMap: ObstacleAxisMap;
  yMap: ObstacleAxisMap;
};
type Guard = { coordinate: Coordinate; direction: Direction };

type State = {
  obstacles: ObstacleReport;
  guard?: Guard;
  labDimensions: [columns: number, rows: number];
};

export class CoordinateSet extends Set<Coordinate> {
  // Constructor accepts an array of coordinates and adds them to the set
  constructor(initialCoordinates: Coordinate[] = []) {
    super();
    initialCoordinates.forEach((coord) => this.add(coord)); // Add each coordinate to the set
  }

  // Overriding the default `has` method to compare based on coordinate values
  has(coordinate: Coordinate): boolean {
    for (const item of this) {
      if (item[0] === coordinate[0] && item[1] === coordinate[1]) {
        return true;
      }
    }
    return false;
  }

  // Overriding the default `add` method to ensure we only add unique coordinates
  add(coordinate: Coordinate): this {
    if (!this.has(coordinate)) {
      super.add(coordinate);
    }
    return this;
  }
}

const state: State = {
  obstacles: {
    coordinates: new CoordinateSet(),
    xMap: new Map(),
    yMap: new Map(),
  },
  labDimensions: [0, 0],
};

const parseInput = (input: string): void => {
  const lines = input.split("\n").map((line) => line.trim());
  if (!lines.length) return;

  const {
    obstacles: { coordinates, xMap, yMap },
  } = state;

  // Clear state
  coordinates.clear();
  xMap.clear();
  yMap.clear();
  delete state.guard;
  state.labDimensions = [lines[0].length, lines.length];

  // repopulate the state again
  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      const char = line.charAt(x);

      // nothing
      if (char === ".") continue;

      // guard
      if (char === "^") {
        state.guard = {
          coordinate: [x, y],
          direction: Direction.N,
        };
        continue;
      }

      // obstacles
      coordinates.add([x, y]);
      (xMap.get(x) ?? xMap.set(x, new Set()).get(x)!).add(y);
      (yMap.get(y) ?? yMap.set(y, new Set()).get(y)!).add(x);
    }
  });
};

const moveGuard = (): boolean => {
  const {
    guard,
    obstacles: { xMap },
  } = state;
  if (!guard) return false;

  const {
    coordinate: [x, y],
    direction,
  } = guard;

  let nextCoordinate: Coordinate;
  switch (direction) {
    case Direction.E:
      nextCoordinate = [x + 1, y];
      break;
    case Direction.S:
      nextCoordinate = [x, y + 1];
      break;
    case Direction.W:
      nextCoordinate = [x - 1, y];
      break;
    case Direction.N:
    default:
      nextCoordinate = [x, y - 1];
      break;
  }

  // check for an obstacle
  if (xMap.get(nextCoordinate[0])?.has(nextCoordinate[1]) ?? false) {
    return false;
  }

  // it's ok to move
  guard.coordinate = nextCoordinate;
  return true;
};

const guardGone = (): boolean => {
  const {
    guard,
    labDimensions: [columns, rows],
  } = state;
  if (!guard) return true;

  const {
    coordinate: [x, y],
  } = guard;

  if (x < 0 || x >= columns || y < 0 || y >= rows) {
    return true;
  }

  return false;
};

const rotateGuard = (): boolean => {
  const { guard } = state;
  if (!guard) return false;

  guard.direction = (guard.direction + 1) % 4;

  return true;
};

const getGuardPatrolRoute = (): Coordinate[] => {
  const { guard } = state;
  if (!guard) return [];

  const guardRoute = [guard.coordinate];

  // don't start moving in circles
  let rotateSequence = 0;

  while (!guardGone()) {
    // move succeeded, reset rotate sequence
    if (moveGuard()) {
      guardRoute.push(guard.coordinate);
      rotateSequence = 0;
      continue;
    }

    // can't move forward, so rotate right
    rotateGuard();
    rotateSequence++;

    // we're stuck turning circles
    if (rotateSequence === 4) throw new Error("Guard is stuck turning circles");
  }

  return guardRoute;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const guardRoute = getGuardPatrolRoute();

  // The unique positions the guard has visited during the patrol
  const guardPositions = new CoordinateSet(guardRoute);

  // As the guard is now positioned outside of the lab we need to substract that one
  const visitedLabPositions = guardPositions.size - 1;

  const { labDimensions } = state;

  return {
    description: `The guard patrolling the lab (${labDimensions.join(
      " x "
    )} has visited ${chalk.underline.white(
      visitedLabPositions
    )} positions, and part 2 is ${chalk.underline.yellow("not solved yet")}.`,
    part1: visitedLabPositions,
    debug: { state, guardRoute },
  };
}
