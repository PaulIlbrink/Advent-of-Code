import chalk from "chalk";

export function solve(input: string): SolveResult {
  const lines = input.split("\n").map((line) => line.trim());

  // check for multiplications
  const mulPattern = /mul\((?<numberX>\d{1,3}),(?<numberY>\d{1,3})\)/g;

  // check for do's and don'ts and their instructions
  const conditionPattern =
    /(?<condition>do(?:n't)?\(\))(?<instructions>.*?)(?=do(?:n't)?\(\)|$)/g;

  // at the beginning multiplications are enabled
  let multiplicationsEnabled = true;

  const { dos, donts } = lines.reduce(
    (dosAndDonts, line: string, idx) => {
      const doLine = `${multiplicationsEnabled ? "do()" : ""}${line}`;

      let conditionMatch;
      let mulMatch;

      while ((conditionMatch = conditionPattern.exec(doLine)) !== null) {
        const { condition, instructions } = conditionMatch.groups!;

        let mulSubtotal = 0;
        while ((mulMatch = mulPattern.exec(instructions)) !== null) {
          const { numberX, numberY } = mulMatch.groups!;
          mulSubtotal += Number(numberX) * Number(numberY);
        }

        // program says don't()
        if (condition !== "do()") {
          dosAndDonts.donts += mulSubtotal;
          multiplicationsEnabled = false;
          continue;
        }

        // program says do()
        dosAndDonts.dos += mulSubtotal;
        multiplicationsEnabled = true;
      }

      return dosAndDonts;
    },
    { dos: 0, donts: 0 }
  );

  const part1 = dos + donts;
  const part2 = dos;

  return {
    description: `The sum of all valid multiplications is ${chalk.underline.white(
      dos + donts
    )} but only ${chalk.underline.yellow(dos)} are executed.`,
    part1,
    part2,
  };
}
