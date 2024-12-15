import chalk from "chalk";

type Page = number;
type PageSet = Set<Page>;
type PageCollection = Page[];
type PageOrderMap = Map<Page, PageSet>;
type PageRestrictions = {
  before: PageOrderMap;
  after: PageOrderMap;
};
type State = {
  orderingRules: PageRestrictions;
  updates: Page[][];
};

const state: State = {
  orderingRules: {
    before: new Map(),
    after: new Map(),
  },
  updates: [],
};

const parseInput = (input: string): boolean => {
  const lines = input.split("\n").map((line) => line.trim());
  if (!lines.length) return false;

  const {
    orderingRules: { before, after },
    updates,
  } = state;

  // Line-type patterns
  const orderPattern = /^(?<first>\d+)\|(?<last>\d+)$/;
  const updatePattern = /^\d+(?:,\d+)*$/;

  // check and parse the lines
  lines.forEach((line) => {
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

const getValidUpdates = (): PageCollection[] => {
  const {
    orderingRules: { before, after },
    updates,
  } = state;

  // return only valid updates
  const validUpdates = updates.filter((update) => {
    // Setup some sets for checking
    const pagesProcessed: PageSet = new Set();
    const pagesToCome: PageSet = new Set(update.values());

    // Only valid when everything conforms with restrictions
    return update.every((page) => {
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
  });

  return validUpdates;
};

export function solve(input: string): SolveResult {
  /* ---------------------------------- Setup --------------------------------- */
  parseInput(input);

  /* --------------------------------- Part 1 --------------------------------- */
  const validUpdates = getValidUpdates();

  const middlePages = validUpdates.map(
    (updatePages) => updatePages.at(Math.floor(updatePages.length / 2))!
  );
  const sumOfMiddlePages = middlePages.reduce(
    (total, pageNr) => total + pageNr
  );

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
    sumOfMiddlePages
  )}, and part 2 is ${chalk.underline.yellow("not solved yet")}.`;

  return {
    description,
    part1: sumOfMiddlePages,
  };
}
