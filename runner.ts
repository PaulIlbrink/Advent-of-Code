import chalk from "chalk";
import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { performance } from "perf_hooks";

// Parse command-line arguments
const args = process.argv.slice(2);
const yearArg = args.find((arg) => /^\d{4}$/.test(arg)) || "2024";
const dayArg = args.find((arg) => /^\d{1,2}$/.test(arg));
const isBenchmark = args.includes("--benchmark");
const useExample = args.includes("--example");

console.log(
  `\n${chalk.red("Advent")} ${chalk.green("of")} ${chalk.red(
    "code"
  )} ${chalk.green("solutions")}\n`
);

async function runSolution(year: string, day?: string, benchmark = false) {
  const basePath = resolve(__dirname, year);
  const days = day ? [day.padStart(2, "0")] : readdirSync(basePath);

  let totalStartTime = performance.now();
  let totalElapsedTime = 0;

  const iterations = benchmark ? 1000 : 1; // Number of repetitions for benchmarking

  for (const d of days) {
    const dayPath = resolve(basePath, d);
    const solutionPath = resolve(dayPath, "solution.ts");
    const inputFile = useExample ? "input.example.txt" : "input.txt";
    const inputPath = resolve(dayPath, inputFile);

    try {
      const input = readFileSync(inputPath, "utf-8");
      const { solve } = await import(solutionPath);

      let elapsedTimes: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        solve(input);
        const endTime = performance.now();
        elapsedTimes.push(endTime - startTime);
      }

      const avgTime =
        elapsedTimes.reduce((sum, t) => sum + t, 0) / elapsedTimes.length;

      const { description } = solve(input); // Run once to get the actual result
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

runSolution(yearArg, dayArg, isBenchmark);
