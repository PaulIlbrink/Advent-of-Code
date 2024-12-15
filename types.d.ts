declare global {
  type SolveResult = {
    description: string;
    part1?: number;
    part2?: number;
    debug?: Object;
  };
}

// To make sure the file is treated as a module, you can add an empty export statement.
export {};
