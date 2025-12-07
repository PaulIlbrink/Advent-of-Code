import chalk from "chalk";
import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { performance } from "perf_hooks";

// Parse command-line arguments
const args = process.argv.slice(2);

// Flags
const isBenchmark = args.includes("--benchmark");
const useExample = args.includes("--example");

// Filter flags
const positional = args.filter((a) => !a.startsWith("--"));

// Year
const yearInput = positional.find((a) => /^\d{4}$/.test(a));

// Day
const dayInput = positional.find(
  (a) => /^\d{1,2}$/.test(a) && Number(a) >= 1 && Number(a) <= 25
);

// 3. AoC jaarlogica (default afhankelijk van maand)
const currentAocYear = (() => {
  const now = new Date();
  return now.getMonth() < 11
    ? now.getFullYear() - 1 // vóór december → vorig AoC jaar
    : now.getFullYear();
})();

const year = String(yearInput ? yearInput : currentAocYear);
const day = dayInput ? String(dayInput) : undefined;

let title = `${chalk.red("Advent")} ${chalk.green("of")} ${chalk.red(
  "code"
)} ${chalk.bold.underline.yellow(year)} ${chalk.green(
  "solution" + (dayInput ? "" : "s")
)}`;

if (isBenchmark) title += ` | ${chalk.blue("Benchmark")}`;
console.log(`\n${title}\n`);

async function runSolution(year: string, day?: string, benchmark = false) {
  const basePath = resolve(__dirname, year);
  const days = day ? [day.padStart(2, "0")] : readdirSync(basePath);

  let totalStartTime = performance.now();
  let totalElapsedTime = 0;

  const iterations = benchmark ? 25 : 1; // Number of repetitions for benchmarking

  for (const d of days) {
    const dayPath = resolve(basePath, d);
    const solutionPath = resolve(dayPath, "solution.ts");
    const inputFile = useExample ? "input.example.txt" : "input.txt";
    const inputPath = resolve(dayPath, inputFile);

    try {
      const input = readFileSync(inputPath, "utf-8");
      const { solve } = await import(solutionPath);

      let elapsedTimes: number[] = [];

      let result;
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        result = solve(input);
        const endTime = performance.now();
        elapsedTimes.push(endTime - startTime);
      }

      const avgTime =
        elapsedTimes.reduce((sum, t) => sum + t, 0) / elapsedTimes.length;

      const { description } = result;
      console.log(`Day ${chalk.green(d)}:`, description);
      console.log(
        "Time Taken:",
        chalk.yellow(
          benchmark
            ? `${avgTime.toFixed(2)}ms (avg over ${iterations} runs)\n`
            : `${elapsedTimes[0].toFixed(2)}ms\n`
        )
      );
      totalElapsedTime += avgTime;
    } catch (error) {
      console.error(`Error running Day ${d}:`, error.message);
    }
  }

  const totalEndTime = performance.now();
  console.log(
    "Total Time Taken:",
    chalk.dim(`${(totalEndTime - totalStartTime).toFixed(2)}ms`)
  );
  console.log(
    "Total Processing Time:",
    chalk.yellow(`${totalElapsedTime.toFixed(2)}ms\n`)
  );
}

runSolution(year, day, isBenchmark);
