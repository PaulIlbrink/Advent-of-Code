import chalk from "chalk";

export function solve(input: string): string {
  const lines = input.split("\n").map((line) => line.trim());

  const rowCount = lines.length;
  const colCount = lines[0].length ?? 0;

  // Let's combine all possible in line the puzzle matrix, starting with the normal horizontal ones
  const matrixLines = {
    horizontal: lines,
    vertical: [] as string[],
    diagonalTopLeft: [] as string[],
    diagonalTopRight: [] as string[],
  };

  // Maps to build up the diagonal strings
  const topLeftDiagonals = new Map<number, string>();
  const topRightDiagonals = new Map<number, string>();

  // part 2 solution
  let xMasCount = 0;
  let cornerPattern = /[MS]/;

  const isXmas = (col: number, row: number, character: string): boolean => {
    // check x-center
    if (character !== "A") return false;

    // a can't be on the outside
    if (col < 1 || col >= colCount - 1 || row < 1 || row >= rowCount - 1)
      return false;

    // check the corners
    const corners = [
      lines[row - 1].charAt(col - 1),
      lines[row - 1].charAt(col + 1),
      lines[row + 1].charAt(col - 1),
      lines[row + 1].charAt(col + 1),
    ];
    const [tl, tr, bl, br] = corners;

    // opposite corners must be different
    if (tl === br || tr === bl) return false;

    // corners must be either an M or S
    if (corners.some((corner) => !cornerPattern.test(corner))) return false;

    return true;
  };

  // now add the vertical ones
  for (let col = 0; col < colCount; col++) {
    let verticalLine = "";
    for (let row = 0; row < rowCount; row++) {
      const character = lines[row].charAt(col);
      verticalLine += character;

      // diagonal from Top Left
      const key = col - row;
      topLeftDiagonals.set(
        key,
        (topLeftDiagonals.get(key) ?? "") + lines[row].charAt(col)
      );

      // diagonal from Top Right
      const colB = colCount - 1 - col;
      const keyB = colB - row;
      topRightDiagonals.set(
        keyB,
        (topRightDiagonals.get(keyB) ?? "") + lines[row].charAt(col)
      );

      // look for X-MAS
      if (isXmas(col, row, character)) xMasCount++;
    }
    matrixLines.vertical.push(verticalLine);
  }

  // Add diagonal lines
  matrixLines.diagonalTopLeft.push(
    ...topLeftDiagonals.entries().map(([_, line]) => line)
  );
  matrixLines.diagonalTopRight.push(
    ...topRightDiagonals.entries().map(([_, line]) => line)
  );

  const { horizontal, vertical, diagonalTopLeft, diagonalTopRight } =
    matrixLines;

  const combinedLines = [
    horizontal,
    vertical,
    diagonalTopLeft,
    diagonalTopRight,
  ].flat();

  // Now let's check all possible lines for the amount of occurances of XMAS or SMAX.
  const totalWords = combinedLines.reduce((words, line) => {
    words += line.match(/XMAS/g)?.length ?? 0;
    words += line.match(/SAMX/g)?.length ?? 0;
    return words;
  }, 0);

  return `The ${colCount} x ${rowCount} matrix contains the word XMAS ${chalk.underline.white(
    totalWords
  )} times, but only ${chalk.underline.yellow(xMasCount)} X-MAS'es were found.`;
}
