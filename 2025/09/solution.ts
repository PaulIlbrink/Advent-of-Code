import chalk from "chalk";
import { Direction } from "../../2024/06/solution";

// #region Part 1 stuff
export type Side = [start: number, end: number, direction: Direction];
export type Edge = [
  start: number,
  end: number,
  direction: Direction,
  incoming: Direction,
  outgoing: Direction
];

export type EdgeMap = Map<number, Edge[]>;

export type Tile = [x: number, y: number, to?: Direction, from?: Direction];

export type State = {
  redTiles: Tile[];
  colEdges: EdgeMap;
  rowEdges: EdgeMap;
  turnOffset: number;
  clockWise: boolean;
  colEdgesExtended: EdgeMap;
  rowEdgesExtended: EdgeMap;
};
export const state: State = {
  redTiles: [],
  turnOffset: 0,
  colEdges: new Map(),
  rowEdges: new Map(),
  clockWise: false,
  colEdgesExtended: new Map(),
  rowEdgesExtended: new Map(),
};

export const resetState = () => {
  state.redTiles.length = 0;
  state.turnOffset = 0;
  state.colEdges.clear();
  state.rowEdges.clear();
  state.clockWise = false;
  state.colEdgesExtended.clear();
  state.rowEdgesExtended.clear();
};

export const rightTurns = (
  direction: Direction,
  prevDirection?: Direction
): number => {
  if (!prevDirection) return 0;

  const change = (4 + direction - prevDirection) % 4;

  return ((change + 1) % 4) - 1;
};

export const setDirection = (
  tile: Tile,
  nextTile: Tile,
  prevTile?: Tile
): number => {
  const [x, y] = tile;
  const [xNext, yNext] = nextTile;

  if (x === xNext && y === yNext) throw new Error("Overlapping tiles");

  let direction;
  if (x === xNext) {
    direction = yNext > y ? Direction.N : Direction.S;
    tile[2] = direction;

    if (!prevTile) return 0;

    const [_x, _y, prevDirection] = prevTile;
    return rightTurns(direction, prevDirection);
  }

  // y === yNext
  direction = xNext > x ? Direction.E : Direction.W;
  tile[2] = direction;

  if (!prevTile) return 0;

  const [_x, _y, prevDirection] = prevTile;

  return rightTurns(direction, prevDirection);
};
// #endregion
export const isHorizontal = (dir: Direction): boolean =>
  ![Direction.N, Direction.S].includes(dir);

export const addEdge = (map: EdgeMap, index: number, edge: Edge) => {
  if (!map.has(index)) map.set(index, []);

  map.get(index)?.push(edge);
};

export const initEdges = (): void => {
  const { redTiles, colEdges, rowEdges } = state;

  if (redTiles.length < 4)
    throw new Error("Expected there to be at least 4 tiles :(");

  const [[_xPrev, _yPrev, dirPrev], [x, y, dir]] = redTiles.slice(-2);

  for (const tile of redTiles) {
    const [xNext, yNext, dirNext] = tile;

    if ([dirPrev, dir, dirNext].includes(undefined))
      throw new Error("Can't init edges when directions arent all set");

    if (isHorizontal(dir!)) {
      addEdge(rowEdges, x, [y, yNext, dir!, dirPrev!, dirNext!]);
      continue;
    }

    addEdge(colEdges, y, [x, xNext, dir!, dirPrev!, dirNext!]);
  }
};

export const parseInput = (input: string): void => {
  if (!input) throw new Error("Input is missing");

  resetState();

  const lines = input.split("\n").map((line) => line.trim());

  const { redTiles } = state;

  let prevTile, prevPrevTile;
  let turnOffset = 0;

  for (const line of lines) {
    const numbers = line.split(",").map(Number);
    if (numbers.length !== 2) continue;

    const tile = numbers as Tile;

    if (prevTile) {
      turnOffset += setDirection(prevTile, tile, prevPrevTile);
      prevPrevTile = prevTile;
    }

    redTiles.push(tile);
    prevTile = tile;
  }

  if (redTiles.length < 2)
    throw new Error("The input is incomplete, at least 2 red tiles are needed");

  // the first 2 tiles need to be revisited to complete the direction/turn values
  for (const tile of redTiles.slice(0, 2)) {
    turnOffset += setDirection(prevTile!, tile, prevPrevTile!);
    prevPrevTile = prevTile;
    prevTile = tile;
  }

  state.turnOffset = turnOffset;
  state.clockWise = turnOffset === 4;
};

export const rectSize = ([xA, yA]: Tile, [xB, yB]: Tile): number => {
  return (Math.abs(xA - xB) + 1) * (Math.abs(yA - yB) + 1);
};

export const isSideColored = (
  idx: number,
  side: Edge,
  isRow = false
): boolean => {
  const { rowEdges, colEdges } = state;
  const [start, end] = side;

  const sideMap = isRow ? rowEdges : colEdges;

  // crossing lines or just a 180 degree point i guess
  if (!sideMap.has(idx)) return false;

  const sideEdges: Edge[] = sideMap.get(idx)!;

  //
  const fullyCovered = sideEdges.some(
    ([startE, endE]) =>
      Math.min(startE, endE) <= Math.min(start, end) &&
      Math.max(start, end) <= Math.max(startE, endE)
  );
  return fullyCovered;

  return false;
};

export const isColorRectangle = (
  [xA, yA, dirA]: Tile,
  [xB, yB, dirB]: Tile
): boolean => {
  if (xA === xB && yA === yB) return true;

  // a single line rectangle, the area is small, so unlikely to be largest, ignore for now
  if (xA === xB || yA === yB) return false;

  return false;

  // ok, we should check all 4 sides
  const horizontal: Edge = [xA, xB];
  const vertical: Edge = [yA, yB];

  const topIdx = Math.max(yA, yB);
  const bottomIdx = Math.min(yA, yB);
  const leftIdx = Math.min(xA, xB);
  const rightIdx = Math.max(xA, xB);

  const topOk = isSideColored(topIdx, horizontal, true);
  const bottomOk = isSideColored(bottomIdx, horizontal, true);
  const leftOk = isSideColored(leftIdx, vertical, true);
  const rightOk = isSideColored(rightIdx, vertical, true);

  const sidesOk = [topOk, rightOk, bottomOk, leftOk];

  const totalOk = sidesOk.length;

  return totalOk >= 2;

  //   return false;
};

export const maxRectangle = (fullColor = false): number => {
  const { redTiles } = state;

  let max = -1;
  let maxA, maxB;
  for (const tileA of redTiles) {
    for (const tileB of redTiles) {
      // we already found a larger rectangle OR tiles are the same
      const size = rectSize(tileA, tileB);
      if (size <= max || size === 1) continue;

      // has non-colored tiles, abort
      if (fullColor && !isColorRectangle(tileA, tileB)) {
        continue;
      }

      max = size;
      maxA = tileA;
      maxB = tileB;
    }
  }

  //   if (fullColor) console.log("masSize", max, "for tiles", maxA, "and", maxB);
  return max;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = maxRectangle();
  const part1fmt = chalk.underline.white(part1);
  let description = `The largest rectangle covers an area of ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  initEdges();

  const part2: number = maxRectangle(true);
  const part2fmt = chalk.underline.yellow(part2);
  description += `, the largest rectangle using red and green tiles is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
