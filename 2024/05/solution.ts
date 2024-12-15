import chalk from "chalk";

type Page = number;
type PageSet = Set<Page>;
type PageCollection = Page[];
type PageOrderMap = Map<Page, PageSet>;
type UpdateValidationResult = {
  valid: PageCollection[];
  invalid: PageCollection[];
};
type PageRestrictions = {
  before: PageOrderMap;
  after: PageOrderMap;
};
type State = {
  orderingRules: PageRestrictions;
  updates: Page[][];
  validationResult: UpdateValidationResult;
};

const state: State = {
  orderingRules: {
    before: new Map(),
    after: new Map(),
  },
  updates: [],
  validationResult: {
    valid: [],
    invalid: [],
  },
};

const parseInput = (input: string): boolean => {
  const lines = input.split("\n").map((line) => line.trim());
  if (!lines.length) return false;

  const {
    orderingRules: { before, after },
    updates,
  } = state;

  // clear state
  before.clear();
  after.clear();
  updates.length = 0;

  // Line-type patterns
  const orderPattern = /^(?<first>\d+)\|(?<last>\d+)$/;
  const updatePattern = /^\d+(?:,\d+)*$/;

  // check and parse the lines
  lines.forEach((line, idx) => {
    // updates
    if (updatePattern.test(line)) {
      updates.push(line.split(",").map(Number));
      return;
    }

    // nothing
    if (!orderPattern.test(line)) return;

    // restrictions
    const { first, last } = orderPattern.exec(line)!.groups!;
    const [firstNum, lastNum] = [Number(first), Number(last)];

    // create a set if needed
    if (!before.has(firstNum)) before.set(firstNum, new Set());
    if (!after.has(lastNum)) after.set(lastNum, new Set());

    // add the relevant numbers
    before.get(firstNum)!.add(lastNum);
    after.get(lastNum)!.add(firstNum);
  });

  return true;
};

const validateUpdates = (): PageCollection[] => {
  const {
    orderingRules: { before, after },
    updates,
    validationResult: { valid, invalid },
  } = state;

  // reset validation result
  valid.length = 0;
  invalid.length = 0;

  // return only valid updates
  updates.forEach((update) => {
    // Setup some sets for checking
    const pagesProcessed: PageSet = new Set();
    const pagesToCome: PageSet = new Set(update.values());

    // Only valid when everything conforms with restrictions
    const isValidUpdate = update.every((page) => {
      // We've already processed pages that were only allowed to come after this one
      if (
        before.has(page) &&
        before.get(page)!.intersection(pagesProcessed).size
      ) {
        console.log("We detected a viol");
        return false;
      }

      // We've still have to process a couple of pages that should have already be done by now
      if (after.has(page) && after.get(page)!.intersection(pagesToCome).size) {
        return false;
      }

      // update the sets
      pagesToCome.delete(page);
      pagesProcessed.add(page);

      return true;
    });

    isValidUpdate ? valid.push(update) : invalid.push(update);
  });

  return valid;
};

const sortUpdate = (update: PageCollection): PageCollection => {
  const sortedUpdate: PageCollection = [...update];

  const {
    orderingRules: { before, after },
  } = state;

  sortedUpdate.sort((a, b) => {
    if (before.has(a) && before.get(a)!.has(b)) return -1;
    if (after.has(a) && after.get(a)?.has(b)) return 1;

    return 0;
  });

  return sortedUpdate;
};

const getMiddlePages = (updates: PageCollection[]) =>
  updates.map((update) => update.at(Math.floor(update.length / 2))!);

const getMiddlePageSum = (update: PageCollection) =>
  update.reduce((sum, page) => sum + page, 0);

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const validUpdates = validateUpdates();

  const {
    validationResult: { valid, invalid },
  } = state;

  const validMiddlePages = getMiddlePages(validUpdates);
  const validMiddlePageSum = getMiddlePageSum(validMiddlePages);

  /* --------------------------------- Part 2 --------------------------------- */

  const sortedInvalidUpdates = invalid.map((unsorted) => sortUpdate(unsorted));
  const sortedMiddlePages = getMiddlePages(sortedInvalidUpdates);
  const sortedMiddlePageSum = getMiddlePageSum(sortedMiddlePages);

  /* ------------------------------ Final result ------------------------------ */

  const {
    orderingRules: { before },
    updates,
  } = state;

  const totalOrderingRules = before.values().reduce((totalRules, ruleSet) => {
    return (totalRules += ruleSet.size);
  }, 0);

  let description = `We have ${totalOrderingRules} ordering rules and a total of ${updates.length} updates to the safety manual.\n`;
  description += `Out of these updates only ${
    validUpdates.length
  } were valid and the sum of their middle pages is ${chalk.underline.white(
    validMiddlePageSum
  )}.\n`;
  description += `After sorting the ${
    sortedInvalidUpdates.length
  } invalid updates we found the sum of their middle pages to be ${chalk.underline.yellow(
    sortedMiddlePageSum
  )}.`;

  return {
    description,
    part1: validMiddlePageSum,
    part2: sortedMiddlePageSum,
  };
}
