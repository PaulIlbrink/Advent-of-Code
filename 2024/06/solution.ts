import chalk from "chalk";
import { reverse } from "dns";

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
  loopHoles?: BasicCoordinateSet;
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

  // Overriding the `delete` method to remove based on coordinate values
  delete(coordinate: Coordinate): boolean {
    for (const item of this) {
      if (item.x === coordinate.x && item.y === coordinate.y) {
        return super.delete(item);
      }
    }
    return false;
  }
}

export class CoordinateSet extends BasicCoordinateSet {
  // Overriding the default `has` method to compare based on coordinate values
  has(coordinate: Coordinate): boolean {
    for (const item of this) {
      if (
        item.x === coordinate.x &&
        item.y === coordinate.y &&
        item.direction === coordinate.direction &&
        coordinate.direction
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

  // Overriding the `delete` method to remove based on coordinate values and direction
  delete(coordinate: Coordinate): boolean {
    for (const item of this) {
      if (
        item.x === coordinate.x &&
        item.y === coordinate.y &&
        item.direction === coordinate.direction
      ) {
        return super.delete(item);
      }
    }
    return false;
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

const nextCoordinate = (position: Coordinate): Coordinate => {
  const { x, y, direction } = position;

  if (!direction) {
    throw new Error("This position is missing a direction");
  }

  const nextCoordinate = { x, y, direction };

  switch (direction) {
    case Direction.E:
    case Direction.W:
      nextCoordinate.x = x - direction + 3;
      break;
    case Direction.N:
    case Direction.S:
    default:
      nextCoordinate.y = y + direction - 2;
      break;
  }

  return nextCoordinate;
};

const moveGuard = (): boolean => {
  const {
    guard,
    obstacles: { coordinates },
  } = state;
  if (!guard) return false;

  const { position } = guard;
  let nextPosition = nextCoordinate(position);

  // blocked
  if (coordinates.has(nextPosition)) {
    guard.route.add(guard.position);
    guard.visited.add(guard.position);
    return false;
  }

  // can move, so update stuff
  guard.route.add(guard.position);
  guard.visited.add(guard.position);
  guard.position = nextPosition;

  return true;
};

const patrolFinished = (guard?: Guard): boolean => {
  const {
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

const nextDirection = (direction: Direction): Direction => (direction % 4) + 1;

const rotateGuard = (): boolean => {
  const { guard } = state;
  if (!guard?.position.direction) return false;

  guard.position.direction = nextDirection(guard.position.direction);

  return true;
};

// move forward
const doPatrol = () => {
  const { guard } = state;
  if (!guard) return false;

  // don't start moving in circles
  let rotateSequence = 0;

  while (!patrolFinished(guard)) {
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

const findLoop = (scout: Guard, block: Coordinate): boolean => {
  const {
    obstacles: { coordinates },
  } = state;

  // the standard obstacles and the scientist block
  const scoutObstacles = structuredClone(coordinates);
  scoutObstacles.add(block);

  // keep walking
  let nextPosition: Coordinate;
  do {
    nextPosition = nextCoordinate(scout.position);

    // This looks familiar... BECAUSE WE HAVE BEEN HERE BEFORE
    if (scout.route.has(nextPosition)) {
      console.log("loop found after", scout.visited.size);
      return true;
    }

    // Hmm a blockage, lets turn right
    let rotateCount = 0;
    while (scoutObstacles.has(nextPosition) && rotateCount < 4) {
      nextPosition.direction = nextDirection(nextPosition.direction!);
      rotateCount++;
    }

    // We're stuck in a single position, so technically in a loop?
    if (rotateCount >= 4) {
      console.log("CIRCLE found");
      return true;
    }

    // Ok we can proceed
    scout.route.add(scout.position);
    scout.visited.add(scout.position);
    scout.position = nextPosition;

    // did we reach the edge?
  } while (!patrolFinished(scout));

  console.log("left the lab after", scout.visited.size);

  return false;
};

const searchForLoopHoles = () => {
  const { guard } = state;

  // wait for patrol to finish
  if (!guard || !patrolFinished()) return;

  const loopHoles = new BasicCoordinateSet();

  // let's keep the original guard intact
  const { route, position: guardPosition } = guard;

  //
  const searchRouteSet = structuredClone(route);
  const searchRouteArr = Array.from(searchRouteSet).reverse();

  // Need the previous element for reference, so
  let lastPosition = guardPosition;

  for (let i = 0; i < searchRouteArr.length; i++) {
    const position = searchRouteArr[i];

    // shorten the route till we get back at the start
    searchRouteSet.delete(position);

    // skip, turned? (duplicate sequentiel coordinates)
    if (position.x === lastPosition.x && position.y === lastPosition.y) {
      continue;
    }

    // already tried this, but since we're reversing that the earlier check is invalid
    if (loopHoles.has(lastPosition)) {
      loopHoles.delete(lastPosition);
    }

    // see what happens if we would have turned right here.
    const scout: Guard = {
      position,
      route: structuredClone(searchRouteSet), // should be trimmed
      visited: new BasicCoordinateSet(),
    };

    // rotate right
    scout.position.direction = nextDirection(scout.position.direction!);

    // continue on the new path
    const foundLoop: boolean = findLoop(scout, lastPosition);

    console.log(
      `Scout #${i} is with routes ${searchRouteSet.size}, succesfull? ${foundLoop} total loopholes found ${loopHoles.size}`
    );

    // we found a loop
    if (foundLoop) {
      loopHoles.add(lastPosition);
    }

    lastPosition = position;
  }

  state.obstacles.loopHoles = loopHoles;
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

  const { visited } = guard;

  const totalPositions = columns * rows;
  const nonBlockedPositions = totalPositions - coordinates.size;
  const visitedPositions = visited.size;

  let description = `The guard patrolling the lab (${columns}x${rows} = ${totalPositions}) has visited ${chalk.underline.white(
    visitedPositions
  )} out of ${nonBlockedPositions} possible positions (${Math.round(
    (100 * visitedPositions) / nonBlockedPositions
  )}%)`;

  /* --------------------------------- Part 2 --------------------------------- */

  searchForLoopHoles();

  const {
    obstacles: { loopHoles },
  } = state;

  const loopableCoordinates = loopHoles?.size || -1;

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
