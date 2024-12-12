export function solve(input: string): string {
  const lines = input.split("\n").map((line) => line.trim());

  const reports = lines.map((line) => line.split(/\s+/).map(Number));

  const isSafeLevel = (
    level: number,
    prevLevel: number,
    state: { increasing: boolean }
  ) => {
    const change = level - prevLevel;

    // no change
    if (change === 0) return false;

    // change too big
    if (Math.abs(change) > 3) return false;

    // direction change
    if (level - prevLevel > 0 !== state.increasing) {
      state.increasing = !state.increasing;
      return false;
    }

    return true;
  };

  type ReportStats = {
    safe: number;
    safeAfterDampening: number;
  };

  /* --------------------------------- Part 1 & 2  --------------------------------- */
  const { safe, safeAfterDampening } = reports.reduce<ReportStats>(
    (total: ReportStats, levels, index) => {
      // nothing to compare, so all fine
      if (levels.length < 2) {
        total.safe++;
        total.safeAfterDampening++;
        return total;
      }

      let prevLevel = levels[0];
      let level: number;
      const state = { increasing: levels[1] - levels[0] > 0 };

      const unsafeIndexes: number[] = [];
      for (let i = 1; i < levels.length; i++) {
        level = levels[i];

        if (!isSafeLevel(level, prevLevel, state)) {
          unsafeIndexes.push(i);
        }
      }

      // unsafe for sure
      if (unsafeIndexes.length > 2) {
        return total;
      }

      // safe for sure
      if (unsafeIndexes.length === 0) {
        total.safeAfterDampening++;
        total.safe++;
        return total;
      }

      // only one mismatch found
      if (unsafeIndexes.length === 1) {
        const index = unsafeIndexes[0];

        // first or last
        if (index === 1 || index === levels.length - 1) {
          total.safeAfterDampening++;
        }

        return total;
      }

      return total;
    },
    { safe: 0, safeAfterDampening: 0 } as ReportStats
  );

  return `From the total of ${reports.length} reports ${safe} are safe and ${safeAfterDampening} are safe after dampening`;
}
