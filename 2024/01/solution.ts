import chalk from "chalk";

export function solve(input: string): string {
  const lines = input.split("\n").map((line) => line.trim());

  /* --------------------------------- Part 1 --------------------------------- */
  const { a, b } = lines.reduce(
    (locations, line) => {
      const numbers = line.split(/\s+/).map(Number);

      if (numbers.length === 2) {
        locations.a.push(numbers[0]);
        locations.b.push(numbers[1]);
      }

      return locations;
    },
    { a: [], b: [] } as { a: number[]; b: number[] }
  );

  a.sort();
  b.sort();

  let distance = 0,
    similarity = 0;
  for (let i = 0, j = 0; i < a.length; i++) {
    distance += Math.abs(a[i] - b[i]);

    /* --------------------------------- Part 2 --------------------------------- */

    // skip through b locations for first possible match
    while (b[j] < a[i] && j < b.length) {
      j++;
    }

    // check for matching locations
    let occurances = 0;
    while (a[i] === b[j]) {
      occurances++;
      j++;
    }

    // matches found
    if (occurances > 0) {
      similarity += a[i] * occurances;

      // revert j index in case we have a duplicate entry in a locations
      j -= occurances;
    }
  }

  return `The total distance between the lists is ${chalk.underline.white(
    distance
  )} and similarity is ${chalk.underline.yellow(similarity)}`;
}
