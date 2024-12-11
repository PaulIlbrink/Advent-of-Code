import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";

const year = process.argv[2] || "2024";
const day = process.argv[3];

async function runSolution(year: string, day?: string) {
  const basePath = resolve(__dirname, year);
  const days = day ? [day.padStart(2, "0")] : readdirSync(basePath);

  for (const d of days) {
    const dayPath = resolve(basePath, d);
    const solutionPath = resolve(dayPath, "solution.ts");
    const inputPath = resolve(dayPath, "input.txt");

    try {
      const input = readFileSync(inputPath, "utf-8");
      const { solve } = await import(solutionPath);
      const result = solve(input);
      console.log(`Day ${d}:`, result);
    } catch (error) {
      console.error(`Error running Day ${d}:`, error.message);
    }
  }
}

runSolution(year, day);
