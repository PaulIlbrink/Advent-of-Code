import chalk from "chalk";
import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { performance } from "perf_hooks";

const year = process.argv[2] || "2024";
const day = process.argv[3];

async function runSolution(year: string, day?: string) {
  const basePath = resolve(__dirname, year);
  const days = day ? [day.padStart(2, "0")] : readdirSync(basePath);
  let totalStartTime = performance.now(); // Start total timing
  let totalElapsedTime = 0;

  for (const d of days) {
    const dayPath = resolve(basePath, d);
    const solutionPath = resolve(dayPath, "solution.ts");
    const inputPath = resolve(dayPath, "input.txt");

    try {
      const input = readFileSync(inputPath, "utf-8");
      const { solve } = await import(solutionPath);

      const startTime = performance.now(); // Start timing for this solution
      const result = solve(input);
      const endTime = performance.now(); // End timing for this solution

      const elapsedTime = endTime - startTime;
      totalElapsedTime += elapsedTime;

      console.log(`Day ${chalk.green(d)}:`, result);
      console.log("Time Taken:", chalk.yellow(`${elapsedTime.toFixed(2)}ms\n`));
    } catch (error) {
      console.error(`Error running Day ${d}:`, error.message);
    }
  }

  const totalEndTime = performance.now(); // End total timing
  console.log(
    "Total Time Taken:",
    chalk.dim(`${(totalEndTime - totalStartTime).toFixed(2)}ms`)
  );
  console.log(
    "Total Processing Time:",
    chalk.yellow(`${totalElapsedTime.toFixed(2)}ms\n`)
  );
}

runSolution(year, day);
