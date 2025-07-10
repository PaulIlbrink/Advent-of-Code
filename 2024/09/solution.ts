import chalk from "chalk";

export type Total = { fileSize: number; freeSpace: number };

export type State = {
  fileSizes: number[];
  freeSpaces: number[];
  totalFileSize: number;
  totalFreeSpace: number;
  spaceFiles: Map<number, number[]>;
};
export const state: State = {
  fileSizes: [],
  freeSpaces: [],
  totalFileSize: 0,
  totalFreeSpace: 0,
  spaceFiles: new Map(),
};

export const resetState = () => {
  state.fileSizes.length = 0;
  state.freeSpaces.length = 0;
  state.totalFileSize = 0;
  state.totalFreeSpace = 0;
  state.spaceFiles.clear();
};

export const parseInput = (input: string): void => {
  if (input.length === 0) return;

  if (input.length % 2 === 0)
    throw new Error("Unexpected input, we assume length should be uneven");

  resetState();

  const { fileSizes, freeSpaces } = state;
  let { totalFileSize, totalFreeSpace } = state;

  let fileSize = Number(input.charAt(0));
  let freeSpace: number;
  fileSizes.push(fileSize);
  totalFileSize += fileSize;

  for (let i = 1; i < input.length; i += 2) {
    freeSpace = Number(input.charAt(i));
    freeSpaces.push(Number(input.charAt(i)));
    totalFreeSpace += freeSpace;

    fileSize = Number(input.charAt(i + 1));
    fileSizes.push(fileSize);
    totalFileSize += fileSize;
  }

  state.totalFileSize = totalFileSize;
  state.totalFreeSpace = totalFreeSpace;
};

export const sumRange = (start: number, length: number): number => {
  const end = start + length - 1;
  const sum = (length / 2) * (start + end);

  return sum;
};

export const filePartChecksum = (
  id: number,
  index: number,
  length: number,
  debug = ""
) => {
  const cc = id * sumRange(index, length);
  if (debug.length)
    console.log(
      `[${debug}] cc ${cc} = id ${id} * (index ${index}, length ${length})`
    );
  return cc;
};

export const compactFileSystemChecksum = (): number => {
  const { fileSizes, freeSpaces } = state;

  let checksum = 0;

  let idx = 0;
  let id = 0;
  let length;

  let idEnd = fileSizes.length - 1;
  let lengthEnd = fileSizes[idEnd];

  do {
    // from the left
    length = id === idEnd ? lengthEnd : fileSizes[id];
    checksum += filePartChecksum(id, idx, length);
    idx += length;

    // fill free space with files from the end
    let free = freeSpaces[id];

    // free space is enough for the (full or partial) file at the end
    while (free >= lengthEnd && id < idEnd) {
      checksum += filePartChecksum(idEnd, idx, lengthEnd);
      free -= lengthEnd;
      idx += lengthEnd;

      idEnd--;
      lengthEnd = fileSizes[idEnd];
    }

    // we're at the final file already, no more relevant free space?
    if (id === idEnd) {
      break;
    }

    // free space can fit a part of the file at the end
    checksum += filePartChecksum(idEnd, idx, free);

    if (id === idEnd) {
      break;
    }

    lengthEnd -= free;
    idx += free;
    free = 0;

    id++;
  } while (id <= idEnd);

  return checksum;
};

export const defragFileSystemChecksum = (): number => {
  const { fileSizes, freeSpaces, spaceFiles } = state;

  let checksum = 0;

  let minSpaceId = 0;
  let spaceId: number;
  let size: number;

  const movedFiles = new Set<number>();

  // move files
  for (
    let fileId = fileSizes.length - 1;
    fileId >= 0 && fileId > minSpaceId;
    fileId--
  ) {
    size = fileSizes[fileId];
    spaceId = minSpaceId;

    // search for enough space
    while (freeSpaces[spaceId] < size && spaceId < fileId) {
      spaceId++;
    }

    // file can't be moved
    if (spaceId >= fileId) {
      continue;
    }

    // move file into free space
    if (!spaceFiles.has(spaceId)) {
      spaceFiles.set(spaceId, [fileId]);
    } else {
      spaceFiles.get(spaceId)?.push(fileId);
    }
    // keep track which files were moved
    movedFiles.add(fileId);

    // reduce remaining
    freeSpaces[spaceId] -= size;

    // space is filled, so no need to keep checking
    if (spaceId === minSpaceId) {
      while (freeSpaces[spaceId] === 0) {
        minSpaceId++;
        spaceId++;
      }
    }
  }

  // defragging done, so let's calculate checksum
  let idx = 0;
  for (let id = 0; id < fileSizes.length; id++) {
    size = fileSizes[id];

    // unmoved
    if (!movedFiles.has(id)) {
      checksum += filePartChecksum(id, idx, size);
    }
    // whether file is there or not, it's taking up space
    idx += size;

    // moved files, if any
    spaceFiles.get(id)?.forEach((movedId) => {
      size = fileSizes[movedId];
      checksum += filePartChecksum(movedId, idx, size);

      idx += size;
    });

    idx += freeSpaces[id];
  }

  return checksum;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */

  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */

  const part1: number = compactFileSystemChecksum();
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */

  //   parseInput(input);

  const part2: number = defragFileSystemChecksum();
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
