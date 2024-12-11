export function solve(input: string): string {
  const lines = input.split("\n").map((line) => line.trim());

  /* --------------------------------- Part 1 --------------------------------- */
  const reports = lines.map((line) => line.split(/\s+/).map(Number));

  const safeReports = reports.filter((levels, report) => {
    if (levels.length < 2) {
      return true;
    }

    let prevLevel = levels[0];
    let level: number;
    const climbing = levels[1] - levels[0] > 0;
    for (let i = 1; i < levels.length; i++) {
      level = levels[i];

      const change = level - prevLevel;

      // no change
      if (change === 0) return false;

      // change too big
      if (Math.abs(change) > 3) return false;

      // direction change
      if (level - prevLevel > 0 !== climbing) return false;

      prevLevel = level;
    }

    return true;
  });

  return `From the total of ${reports.length} reports only ${safeReports.length} are considered safe`;
}
