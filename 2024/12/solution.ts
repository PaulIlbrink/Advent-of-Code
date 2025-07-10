import chalk from "chalk";

export enum Dir {
  N = 0,
  E = 1,
  S = 2,
  W = 3,
}
export const ALL_DIRECTIONS: Dir[] = Object.values(Dir).filter(
  (val) => typeof val === "number"
) as Dir[];

export type Plant = string;
export type Plot = {
  x: number;
  y: number;
  plant: Plant;
  adjacent: Array<Plot | undefined>;
  fenceDirections: Dir[];
  regionIdx: number;
};
export type Region = Set<Plot>;

export type State = {
  regions: Map<Plant, Region[]>;
  matrix: Plot[][];
  plots: Plot[];
};

export const state: State = {
  regions: new Map(),
  matrix: [],
  plots: [],
};

export const resetState = () => {
  state.regions.clear();
  state.matrix.length = 0;
  state.plots.length = 0;
};

export const parseInput = (input: string): void => {
  resetState();

  populateMatrix(input);
  updateAdjacentAndFences();
  updateRegions();
};

export const populateMatrix = (input: string) => {
  const lines = input.split("\n").map((line) => line.trim().split(""));

  // fill matrix
  const { matrix, plots } = state;
  lines.forEach((line, y) => {
    line.forEach((char, x) => {
      const plot = {
        x,
        y,
        plant: char,
        adjacent: [],
        fenceDirections: [],
        regionIdx: -1,
      };

      if (!matrix[x]) matrix[x] = [];

      matrix[x][y] = plot;

      plots.push(plot);
    });
  });
};

export const updateAdjacentAndFences = () => {
  const { matrix } = state;

  // update adjacent + fences
  matrix.forEach((rows, x) => {
    rows.forEach((plot, y) => {
      const { plant, adjacent } = plot;
      adjacent.push(
        ...[
          y === 0 ? undefined : matrix.at(x)?.at(y - 1),
          matrix.at(x + 1)?.at(y),
          matrix.at(x)?.at(y + 1),
          x === 0 ? undefined : matrix.at(x - 1)?.at(y),
        ]
      );

      plot.fenceDirections = adjacent.reduce((fenceDirs, adj, dir) => {
        if (plant !== adj?.plant) fenceDirs.push(dir);
        return fenceDirs;
      }, Array<Dir>());
    });
  });
};

export const updateRegions = () => {
  const { plots, regions } = state;

  plots.forEach((plot) => {
    const { plant } = plot;

    // No regions defined yet
    if (!regions.has(plant)) {
      plot.regionIdx = 0;
      regions.set(plant, [new Set([plot])]);
      return;
    }

    const plantRegions = regions.get(plant)!;
    if (plantRegions.length === 0)
      throw new Error("Found empty plant regions array");

    // existing regionIds from neighbouring plots
    const adjacentRegionIdxs = [
      ...new Set(
        plot.adjacent
          .filter((adj) => plant === adj?.plant && adj.regionIdx > -1)
          .map((adj) => adj!.regionIdx)
      ),
    ];

    let regionIdx;

    // there are existing regions for this plant, but they don't seem to be connected, so lets create a new one
    if (adjacentRegionIdxs.length === 0) {
      regionIdx = plantRegions.length;
      plot.regionIdx = regionIdx;
      plantRegions.push(new Set([plot]));
      return;
    }

    // a single existing region found
    if (adjacentRegionIdxs.length === 1) {
      regionIdx = adjacentRegionIdxs.at(0)!;
      plot.regionIdx = regionIdx;
      plantRegions.at(regionIdx)?.add(plot);
      return;
    }

    // oh dear, multiple region idx's found, so they actually connect here, so we need to do some merging
    regionIdx = adjacentRegionIdxs.sort().shift()!;
    plot.regionIdx = regionIdx; // we use the lowest idx here

    const mergedRegion = plantRegions.at(regionIdx);
    if (!mergedRegion) {
      throw new Error("Merged region is undefined??");
    }
    mergedRegion.add(plot);

    // also move the remaining entries to the correct region now, starting by the highest idx
    adjacentRegionIdxs.reverse().forEach((aIdx) => {
      // move plots to the correct first region
      plantRegions.at(aIdx)?.forEach((mergePlot) => {
        mergePlot.regionIdx = regionIdx;
        mergedRegion.add(mergePlot);
      });

      // empty the unused region, but don't remove it as indexes won't match anymore
      plantRegions.at(aIdx)?.clear();
    });
  });
};

export const calculateFencePrice = (): number => {
  const { regions } = state;
  let fencePrice = 0;

  regions.forEach((plantRegions) => {
    plantRegions.forEach((region) => {
      const area = region.size;
      const fences = region
        .values()
        .reduce((total, plot) => total + plot.fenceDirections.length, 0);
      fencePrice += area * fences;
    });
  });

  return fencePrice;
};

export const hasFence = (
  region: Region,
  x: number,
  y: Number,
  direction: Dir
): boolean => {
  const regionPlot = region
    .values()
    .find((plot) => plot.x === x && plot.y === y);

  // it's not a plot in this region, so don't bother checking fences
  if (!regionPlot) return false;

  // check if the plot has a fence on the direction
  return regionPlot.fenceDirections.includes(direction);
};

export const sideContinues = (plot: Plot, side: Dir): boolean => {
  return false;
};

export const calculateCorners = (plot: Plot, region: Region): number => {
  const { fenceDirections } = plot;
  const fences = fenceDirections.length;

  // no fences no corners, or sides have fences which equals 4 corners
  if (fences === 0 || fences === 4) return fences;

  /**
   * for the remaining cases it's impossible to determine the exact amount of corners without looking at surrounding plots, because we're searching for reverse angles
   * - 3 fences, at least 2 corners but also could be 3 (or 4, but that one should count towards another plot)
   * - 2 fences, when they connect N+E or S+W for example at last 1 corner but possibly 2 (or 3)
   *             when they're opposite of eachother at least 0 but could be 1 (or 2) for each side
   * - 1 fences, basically the same situation as a single side of the situation with 2 fences 0 or 1 (or 2)
   *
   * To not count double corners (on surrounding plots) let's just look towards the clockwise direction
   */

  const corners = fenceDirections.reduce((plotCorners: number, dir: Dir) => {
    const nextDir: Dir = (dir + 1) % 4;

    // nextDir is fenced, so it's a normal "closed" corner, so let's count it
    if (fenceDirections.includes(nextDir)) return plotCorners + 1;

    // nextDir is open, check if next plot continues the fence/side or if it's a reverse corner
    let plotX = plot.x,
      plotY = plot.y;
    switch (nextDir) {
      case Dir.N:
      case Dir.S:
        plotY += -1 + nextDir;
        break;
      case Dir.E:
      case Dir.W:
      default:
        plotX += 2 - nextDir;
        break;
    }

    // the fence doesn't continue in a straight line, so it's a reverse corner
    const sideContinues = hasFence(region, plotX, plotY, dir);
    if (!sideContinues) plotCorners += 1;

    return plotCorners;
  }, 0);

  return corners;
};

export const calculateBulkFencePrice = (): number => {
  const { regions } = state;

  let bulkFencePrice = 0;

  regions.forEach((plantRegions) => {
    plantRegions.forEach((region) => {
      const regionArea = region.size;
      const regionCorners = region
        .values()
        .reduce((total, plot) => total + calculateCorners(plot, region), 0);
      bulkFencePrice += regionArea * regionCorners;
    });
  });

  return bulkFencePrice;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = calculateFencePrice();
  const part1fmt = chalk.underline.white(part1);
  let description = `The total fence costs for all regions is  ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = calculateBulkFencePrice();
  const part2fmt = chalk.underline.yellow(part2);
  description += `, after applying bulk discount the costs are reduced to ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
