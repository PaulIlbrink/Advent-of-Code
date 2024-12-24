import chalk from "chalk";

export type Total = [number, number];

export type State = {
  fileSizes: number[];
  freeSpaces: number[];
  total: Total;
};
export const state: State = {
  fileSizes: [],
  freeSpaces: [],
  total: [0, 0],
};

export const resetState = () => {
  state.fileSizes.length = 0;
  state.freeSpaces.length = 0;
  state.total = [0, 0];
};

export const sumRange = (start: number, length: number): number => {
  const end = start + length - 1;
  const sum = (length / 2) * (start + end);

  //   console.log(`sumrange: ${start}, ${length} => ${sum}`);
  return sum;
};

export const filePartChecksum = (id: number, index: number, length: number) => {
  const cc = id * sumRange(index, length);
  console.log(
    `const cc ${cc} = id ${id} * sumRange(index ${index}, length ${length});`
  );
  return cc;
};

export const parseInput = (input: string): void => {
  if (input.length === 0) return;

  if (input.length % 2 === 0)
    throw new Error("Unexpected input, we assume length should be uneven");

  resetState();

  const { fileSizes, freeSpaces, total } = state;
  let [totalFileSize, totalFreeSpace] = total;

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

  // store totals in state
  state.total = [totalFileSize, totalFreeSpace];
};

export const fileSystemChecksum = (): number => {
  const { fileSizes, freeSpaces, total } = state;
  const [totalFileSize, totalFreeSpace] = total;

  let checksum = 0;

  let idx = 0;
  let id = 0;
  let length;

  let idEnd = fileSizes.length - 1;
  let idxEnd = totalFileSize - 1;
  let lengthEnd = fileSizes[idEnd];

  do {
    // from the left
    length = fileSizes[id];
    checksum += filePartChecksum(id, idx, length);
    idx += length;

    // fill free space with files from the end
    let free = freeSpaces[id];
    // lengthEnd = fileSizes[idEnd];
    console.log("1) idEnd is ", idEnd);
    console.log("1) lengthEnd is ", lengthEnd);

    // free space is enough for the (full or partial) file at the end
    while (free >= lengthEnd) {
      console.log(`free ${free}> lengthEnd ${lengthEnd}`);

      checksum += filePartChecksum(idEnd, idx, lengthEnd);
      free -= lengthEnd;
      idx += lengthEnd;

      idEnd--;
      lengthEnd = fileSizes[idEnd];
      console.log("2) lengthEnd for idEnd(", idEnd, ") is ", lengthEnd);
    }

    // free space can fit a part of the file at the end
    const lengthMin = Math.min(free, lengthEnd);
    checksum += filePartChecksum(idEnd, idx, lengthMin);

    console.log("3) free", free);
    console.log("3) lengthEnd", lengthEnd);
    console.log("3) lengthMin is", lengthMin);
    console.log("3) idEnd is", idEnd);

    idx += lengthMin;

    id++;
  } while (id < idEnd && idx < idxEnd);

  console.log(
    `done system id ${id} < idEnd ${idEnd} && idx ${idx} < ${idxEnd}`
  );

  return checksum;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */

  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */

  const part1: number = fileSystemChecksum(); // not solved yet
  const part1fmt = chalk.underline.white(part1);
  let description = `Part 1 result is ${part1fmt}`;

  /* --------------------------------- Part 2 --------------------------------- */

  const part2: number = 0; // not solved yet
  const part2fmt = chalk.underline.yellow(part2);
  description += `, and part 2 is ${part2fmt}.`;

  /* --------------------------------- Result --------------------------------- */
  return { description, part1, part2 };
}
