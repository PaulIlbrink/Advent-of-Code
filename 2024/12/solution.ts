import chalk from "chalk";

export enum Dir {
  N = 0,
  E = 1,
  S = 2,
  W = 3,
}
export type Plant = string;
export type Plot = {
  x: number;
  y: number;
  plant: Plant;
  adjacent: Array<Plot | undefined>;
  fences: number;
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
        fences: 0,
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

      plot.fences = adjacent.filter((p) => plant !== p?.plant).length;
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

export const calculateFencePrice = () => {
  const { regions } = state;
  let fencePrice = 0;

  regions.forEach((plantRegions) => {
    plantRegions.forEach((region) => {
      const area = region.size;
      const fences = region
        .values()
        .reduce((total, plot) => total + plot.fences, 0);
      fencePrice += area * fences;
    });
  });

  return fencePrice;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const part1: number = calculateFencePrice();
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */
  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
