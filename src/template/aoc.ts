function parse(input: string) {
    const toNumberArray = (s: string): number[] => {
        const re: RegExp = /(-?\d+)/g;
        const matches = re.exec(s) || [];
        //const matches = s.match(re) || [];
        const numbers = matches.map(Number);
        return numbers;
    };

    return input
        .split('\n')
        .map(toNumberArray);
};

export const part1 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    const solution = 0;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    const solution = 0;
    return solution;
};
