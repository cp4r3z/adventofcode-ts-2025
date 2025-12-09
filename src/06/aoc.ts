function parse(input: string) {
    const toNumberArray = (s: string): number[] => {
        const re: RegExp = /(-?\d+)/g;
        //const matches = re.exec(s) || [];
        const matches = s.match(re) || [];
        const numbers = matches.map(Number);
        return numbers;
    };

    const toSymbol = (s: string): string[] => {
        const re: RegExp = /([\+\*])/g;
        //const matches = re.exec(s) || [];
        const matches = s.match(re) || [];
        return matches;
    }

    const rows = input
        .split('\n');

    const last = rows.splice(-1, 1);
    const numberArray = rows
        .map(toNumberArray);

    const operands = Array(numberArray[0].length).fill(null).map(() => Array());


    for (let i = 0; i < numberArray.length; i++) {
        for (let j = 0; j < operands.length; j++) {
            // if (i>numberArray.length)
            operands[j].push(numberArray[i][j]);
        }

    }

    const symbols = last.map(toSymbol)[0];

    return {
        operands,
        symbols
    }
};

function parse2(input: string) {
    const table = input
        .split('\n')
        .map(line => line.split(''));

    const symbols = table.splice(-1, 1)[0].filter(s => s !== ' ');

    let tableRotated = Array(table[0].length).fill(null).map(() => Array(table.length));

    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[0].length; j++) {
            tableRotated[j][i] = table[i][j];
        }
    }

    const operands = [];

    let subOps = [];
    for (let k = 0; k < tableRotated.length; k++) {

        // Completely empty columns
        const isEmpty = tableRotated[k].filter(s => s !== ' ').length === 0;
        if (isEmpty) {
            operands.push(subOps);
            subOps = [];
            continue;
        }

        const joined = tableRotated[k]
            .filter(s => s !== ' ')
            .join('');

        const op = Number(joined)
        subOps.push(op);

        // Last one
        if (k===tableRotated.length-1){
            operands.push(subOps);
        }
    }

    return {
        operands,
        symbols
    }
}

function operation(op: string, operands: number[]): number {

    if (op === '+') {
        return operands.reduce((total, cur) => total + cur, 0);
    }
    // Assuming *
    return operands.reduce((total, cur) => total * cur, 1);
}

export const part1 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    let grandTotal = 0;
    for (let i = 0; i < parsed.symbols.length; i++) {
        const subTotal = operation(parsed.symbols[i], parsed.operands[i]);
        //console.log(subTotal);
        grandTotal += subTotal;
    }
    const solution = grandTotal;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = parse2(input);
    let grandTotal = 0;
    for (let i = 0; i < parsed.symbols.length; i++) {
        const subTotal = operation(parsed.symbols[i], parsed.operands[i]);
        //console.log(subTotal);
        grandTotal += subTotal;
    }
    const solution = grandTotal;
    return solution;
};
