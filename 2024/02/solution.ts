type ReportStats = {
  safe: number;
  safeAfterDampening: number;
};

type UnsafeLevel = {
  index: number;
  reason: string;
};

const checkLevels = (levels: number[]): number => {
  if (levels.length < 2) return -1;

  let previous = levels[0];

  // Establish the required trend from first two numbers
  const trend = Math.sign(levels[1] - previous);

  if (trend === 0) return 1; // No stagnant sequences allowed

  for (let i = 1; i < levels.length; i++) {
    const level = levels[i];
    const direction = Math.sign(level - previous);

    // Must maintain same direction throughout
    if (direction !== trend) {
      // it's not at the beginning, so removing the previous value will still fail
      if (i > 2) {
        return i;
      }

      // remove previous item
      return i - 1;
    }
    const diff = Math.abs(level - previous);

    // Difference must be between 1 and 3
    if (diff > 3) {
      return i;
    }

    previous = level;
  }

  return -1;
};

const dampenLevels = <T>(levels: T[], index: number): T[] => {
  return [...levels.slice(0, index), ...levels.slice(index + 1)];
};

export function solve(input: string): string {
  const lines = input.split("\n").map((line) => line.trim());
  const reports = lines.map((line) => line.split(/\s+/).map(Number));

  const results = reports.reduce<ReportStats>(
    (total, levels) => {
      const unsafeIndex = checkLevels(levels);

      // all fine
      if (unsafeIndex === -1) {
        total.safe++;
        total.safeAfterDampening++;
        return total;
      }

      // when last possible item fails, it's becomes safe when removed
      if (unsafeIndex - 1 === levels.length) {
        total.safeAfterDampening++;
        return total;
      }

      // Try removing the problematic or the one before it
      if (
        checkLevels(dampenLevels(levels, unsafeIndex - 1)) === -1 ||
        checkLevels(dampenLevels(levels, unsafeIndex)) === -1
      ) {
        total.safeAfterDampening++;
      }

      return total;
    },
    { safe: 0, safeAfterDampening: 0 }
  );

  return `From the total of ${reports.length} reports only ${results.safe} are considered safe whilst ${results.safeAfterDampening} are safe after dampening.`;
}
