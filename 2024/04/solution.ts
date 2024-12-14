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

  // now add the vertical ones
  for (let col = 0; col < colCount; col++) {
    let verticalLine = "";
    for (let row = 0; row < rowCount; row++) {
      verticalLine += lines[row].charAt(col);

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

  return `The ${colCount} x ${rowCount} matrix contains the word XMAS exactly ${chalk.underline.white(totalWords)} times.`;
}
