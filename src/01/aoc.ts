function parse(input: string) {
    const toNumberArray = (s: string): number => {
        const re: RegExp = /(\w)(\d+)/g;
        const matches = re.exec(s);
        let n = Number(matches[2]);
        if (matches[1] === 'L') n *= -1;
        return n;
    };

    return input
        .split('\n')
        .map(toNumberArray);
};

export const part1 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    let zeroCount = 0;
    let total = 50;
    for (const number of parsed) {
        total += number;
        total = total % 100;
        if (total === 0) zeroCount++;
    }
    const solution = zeroCount;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    let zeroCount = 0;
    let total = 50;
    for (const number of parsed) {
        const prevTotal = total;

        const turns = Math.floor(Math.abs(number) / 100);
        zeroCount += turns;
        const sub100 = number % 100;
        total += sub100;

        if (total < 0) total += 100;
        if (total === 100) total -= 100;
        total = total % 100;

        if (total === 0) {
            zeroCount++
        } else if (prevTotal !== 0) {
            if (number < 0 && prevTotal < total) {
                // moving left
                zeroCount++;
            }
            if (number > 0 && prevTotal > total) {
                // moving right
                zeroCount++;
            }
        };
    }
    const solution = zeroCount;
    return solution;
};
