import chalk from "chalk";
import { Direction, type Coordinate } from "../../2024/06/solution";

export type Edge = [start: number, end: number];

export type EdgeMap = Map<number, Edge[]>;

export type Tile = [x: number, y: number, direction?: Direction];

export type State = {
  redTiles: Tile[];
  colEdges: EdgeMap;
  rowEdges: EdgeMap;
  turnOffset: number;
  clockWise: boolean;
};
export const state: State = {
  redTiles: [],
  turnOffset: 0,
  colEdges: new Map(),
  rowEdges: new Map(),
  clockWise: false,
};

export const resetState = () => {
  state.redTiles.length = 0;
  state.turnOffset = 0;
  state.colEdges.clear();
  state.rowEdges.clear();
  state.clockWise = false;
};

export const addColorRange = (
  [xA, yA]: Coordinate,
  [xB, yB]: Coordinate
): void => {
  //   const {} = state;
  //   if (xA !== xB && yA !== yB) throw new Error("Coordinates are not alligned!");
  //   if (xA === xB) {
  //     if (!colColors.has(xA)) colColors.set(xA, []);
  //     colColors.get(xA)!.push([Math.min(yA, yB), Math.max(yA, yB)]);
  //     return;
  //   }
  //   if (!rowColors.has(yA)) rowColors.set(yA, []);
  //   rowColors.get(yA)!.push([Math.min(xA, xB), Math.max(xA, xB)]);
};

export const rightTurns = (
  direction: Direction,
  prevDirection?: Direction
): number => {
  if (!prevDirection) return 0;

  const change = (4 + direction - prevDirection) % 4;

  return ((change + 1) % 4) - 1;
};

export const addEdge = (idx: number, edge: Edge, isRow = false): void => {
  const [start, end] = edge;
  if (start === end)
    throw new Error(
      `We shouldn't have a zero-length edge? [idx, [start,end], isRow] = [${idx}, [${start}, ${end}], ${isRow}]`
    );

  const { colEdges, rowEdges } = state;
  if (isRow) {
    if (!rowEdges.has(idx)) rowEdges.set(idx, []);

    rowEdges.get(idx)!.push(edge);
    return;
  }

  if (!colEdges.has(idx)) colEdges.set(idx, []);

  colEdges.get(idx)!.push(edge);
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

    addEdge(x, [y, yNext]);

    const [_x, _y, prevDirection] = prevTile;
    return rightTurns(direction, prevDirection);
  }

  // y === yNext
  direction = xNext > x ? Direction.E : Direction.W;
  tile[2] = direction;

  if (!prevTile) return 0;

  const [_x, _y, prevDirection] = prevTile;
  addEdge(y, [x, xNext], true);

  return rightTurns(direction, prevDirection);
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

  if (fullColor) console.log("masSize", max, "for tiles", maxA, "and", maxB);
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

  const part2: number = maxRectangle(true);
  const part2fmt = chalk.underline.yellow(part2);
  description += `, the largest rectangle using red and green tiles is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
