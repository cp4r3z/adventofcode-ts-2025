import { IInterval, Interval } from '../common/intervals/interval';

function parse(input: string) {
    const toInterval = (s: string): IInterval => {
        const re: RegExp = /(\d+)-(\d+)/g;
        const matches = re.exec(s) || [];
        const numbers = matches.map(Number);
        return new Interval(numbers[1], numbers[2]);
    }

    const inputLists = input.split('\n\n');
    const freshRanges = inputLists[0]
        .split('\n')
        .map(toInterval);
    const ingredients = inputLists[1]
        .split('\n')
        .map(Number);

    return {
        freshRanges, ingredients
    }
};

function isIngredientFresh(ingredient: number, freshRanges: IInterval[]): boolean {
    for (const range of freshRanges) {
        if (range.Contains(ingredient)) return true;
    }
    return false;
}

export const part1 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    const freshIngredients = parsed.ingredients.filter(i => isIngredientFresh(i, parsed.freshRanges));
    const solution = freshIngredients.length;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    // For Part 2 we need to create unions of all the fresh ranges.

    // Keep doing unions of pairs until nothing happens
    let indexA = 0;
    let indexB = 1;
    const frs = parsed.freshRanges;
    while (indexA < frs.length - 1) {
        let unionFound = false;
        while (indexB < frs.length) {
            const result = frs[indexA].Union(frs[indexB]);
            if (result.length === 1) {
                unionFound = true;
                // Remove indexA and indexB, push new union
                frs.splice(indexB, 1); // Assumes index b is always greater than index a
                frs.splice(indexA, 1);
                frs.push(result[0]);
                break;
            }

            indexB++;
        }
        if (unionFound) {
            indexA = 0;
            indexB = 1;
            continue;
        }
        indexA++;
        indexB = indexA + 1;
    }

    frs.sort((a, b) => a.Low - b.Low);

    const solution = frs.reduce((total, cur) => total + cur.size(), 0);
    return solution;
};
