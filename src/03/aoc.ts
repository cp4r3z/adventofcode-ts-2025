function parse(input: string) {
    const toNumberArray = (s: string): number[] => {
        const re: RegExp = /(\d)/g;
        //const matches = re.exec(s) || [];
        const matches = s.match(re) || [];
        const numbers = matches.map(Number);
        return numbers;
    };

    return input
        .split('\n')
        .map(toNumberArray);
};

// Finds the highest "joltage"
function findHighest(arr: number[], batteries: number): number {

    let total = 0;

    let indexStart = 0; // This is where to start the search

    for (let iB = batteries - 1; iB >= 0; iB--) {
        // find the largest in the first digits of the array, leaving enough "places" for the rest of the batteries
        let high = 0;
        let i = indexStart;
        while (i < arr.length - iB) {
            const n = arr[i];
            if (n > high) {
                high = n;
                indexStart = i;
            }
            i++;
        }
        indexStart++;

        // Add the place value to the total
        const mag = Math.pow(10, iB);
        total += high * mag;
    }

    return total;
}

export const part1 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    let total = 0;
    parsed.forEach(bank => {
        const joltage = findHighest(bank, 2);
        //console.log(`joltage = ${joltage}`);
        total += joltage;
    })
    const solution = total;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    let total = 0;
    parsed.forEach(bank => {
        const joltage = findHighest(bank, 12);
        //console.log(`joltage = ${joltage}`);
        total += joltage;
    })
    const solution = total;
    return solution;
};
