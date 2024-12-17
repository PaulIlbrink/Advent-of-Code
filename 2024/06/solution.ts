import chalk from "chalk";

enum Direction {
  N = 1,
  E = 2,
  S = 3,
  W = 4,
}

type BasicCoordinate = { x: number; y: number };
type Coordinate = BasicCoordinate & { direction?: Direction };
type ObstacleAxisMap = Map<number, Set<Number>>;

type ObstacleReport = {
  coordinates: BasicCoordinateSet;
  xMap: ObstacleAxisMap;
  yMap: ObstacleAxisMap;
};

type Guard = {
  position: Coordinate;
  route: CoordinateSet;
  visited: BasicCoordinateSet;
};

type State = {
  obstacles: ObstacleReport;
  guard?: Guard;
  labDimensions: {
    columns: number;
    rows: number;
  };
};

export class BasicCoordinateSet extends Set<Coordinate> {
  // Constructor accepts an array of coordinates and adds them to the set
  constructor(initialCoordinates: Coordinate[] = []) {
    super();
    initialCoordinates.forEach((coord) => this.add(coord)); // Add each coordinate to the set
  }

  // Overriding the default `has` method to compare based on coordinate values
  has(coordinate: Coordinate): boolean {
    for (const item of this) {
      if (item.x === coordinate.x && item.y === coordinate.y) {
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

export class CoordinateSet extends BasicCoordinateSet {
  // Overriding the default `has` method to compare based on coordinate values
  has(coordinate: Coordinate): boolean {
    for (const item of this) {
      if (
        item.x === coordinate.x &&
        item.y === coordinate.y &&
        item.direction === coordinate.direction
      ) {
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
    coordinates: new BasicCoordinateSet(),
    xMap: new Map(),
    yMap: new Map(),
  },
  labDimensions: { columns: 0, rows: 0 },
};

const parseInput = (input: string): void => {
  const lines = input.split("\n").map((line) => line.trim());
  if (!lines.length) return;

  const {
    obstacles: { coordinates, xMap, yMap },
    labDimensions,
  } = state;

  // Clear state
  coordinates.clear();
  xMap.clear();
  yMap.clear();
  labDimensions.columns = lines[0].length;
  labDimensions.rows = lines.length;
  delete state.guard;

  // repopulate the state again
  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      const char = line.charAt(x);

      // nothing
      if (char === ".") continue;

      // guard
      if (char === "^") {
        const position: Coordinate = {
          x,
          y,
          direction: Direction.N,
        };
        state.guard = {
          position,
          route: new CoordinateSet(),
          visited: new BasicCoordinateSet(),
        };
        continue;
      }

      // obstacles
      coordinates.add({ x, y });
      (xMap.get(x) ?? xMap.set(x, new Set()).get(x)!).add(y);
      (yMap.get(y) ?? yMap.set(y, new Set()).get(y)!).add(x);
    }
  });
};

const moveGuard = (): boolean => {
  const {
    guard,
    obstacles: { coordinates },
  } = state;
  if (!guard) return false;

  const {
    position: { x, y, direction },
  } = guard;
  if (!direction) {
    throw new Error("Guard has lost direction");
  }

  let nextCoordinate = { x, y, direction };
  switch (direction) {
    case Direction.E:
    case Direction.W:
      nextCoordinate.x = x - direction + 3;
      break;
    // case Direction.N:
    // case Direction.S:
    default:
      nextCoordinate.y = y + direction - 2;
      break;
  }

  // blocked
  if (coordinates.has(nextCoordinate)) {
    guard.route.add(guard.position);
    guard.visited.add(guard.position);
    return false;
  }

  // can move, so update stuff
  guard.route.add(guard.position);
  guard.visited.add(guard.position);
  guard.position = nextCoordinate;

  return true;
};

const patrolFinished = (): boolean => {
  const {
    guard,
    labDimensions: { columns, rows },
  } = state;
  if (!guard) return true;

  const {
    position: { x, y },
  } = guard;

  if (x < 0 || x >= columns || y < 0 || y >= rows) {
    return true;
  }

  return false;
};

const rotateGuard = (): boolean => {
  const { guard } = state;
  if (!guard?.position.direction) return false;

  guard.position.direction = (guard.position.direction % 4) + 1;

  return true;
};

const doPatrol = () => {
  const { guard } = state;
  if (!guard) return false;

  // don't start moving in circles
  let rotateSequence = 0;

  while (!patrolFinished()) {
    // move succeeded, reset rotate sequence
    if (moveGuard()) {
      rotateSequence = 0;
      continue;
    }

    // can't move forward, so rotate right
    rotateGuard();
    rotateSequence++;

    // we're stuck turning circles
    if (rotateSequence > 3) throw new Error("Guard is stuck turning circles");
  }
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  doPatrol();

  const {
    guard,
    labDimensions: { columns, rows },
    obstacles: { coordinates },
  } = state;
  if (!guard) {
    throw new Error("Guard went missing after patrol");
  }

  const { route, visited } = guard;

  /* --------------------------------- Part 2 --------------------------------- */

  const visitedBefore = route.difference(visited);

  console.log(visitedBefore.size, "positions were checked earlier");

  const loopableCoordinates = visitedBefore.size; // guess

  const totalPositions = columns * rows;
  const nonBlockedPositions = totalPositions - coordinates.size;
  const visitedPositions = visited.size;

  return {
    description: `The guard patrolling the lab (${columns}x${rows} = ${totalPositions}) has visited ${chalk.underline.white(
      visitedPositions
    )} out of ${nonBlockedPositions} possible positions (${Math.round(
      (100 * visitedPositions) / nonBlockedPositions
    )}%), and there are ${chalk.underline.yellow(
      loopableCoordinates
    )} posibilities which can trap the guard in a loop.`,
    part1: visitedPositions,
    part2: loopableCoordinates,
    debug: { state, guard },
  };
}
