export function solve(input: string): string {
  const lines = input.split("\n").map((line) => line.trim());

  const totalSum = lines.reduce((subTotal: number, line: string, idx) => {
    const mulPattern = /mul\((?<numberX>\d{1,3}),(?<numberY>\d{1,3})\)/g;

    let mulMatch;
    while ((mulMatch = mulPattern.exec(line)) !== null) {
      const { numberX, numberY } = mulMatch.groups!;
      subTotal += Number(numberX) * Number(numberY);
    }

    return subTotal;
  }, 0);

  return `The sum of all valid multiplications is ${totalSum}`;
}
