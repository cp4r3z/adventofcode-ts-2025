import { IInterval, Interval } from '../common/intervals/interval';

class ProductRange extends Interval {
    private _getOrderOfMagnitude(n: number) { return Math.floor(Math.log10(n)); }

    private _createInvalid(d: number): number {
        const oom = this._getOrderOfMagnitude(d);
        // multiplier
        //     oom 
        // 9   0   1 10
        // 99  1   2 100 
        // 999 2   3 1000
        const multiplier = Math.pow(10, oom + 1);
        return d + d * multiplier;
    }

    findInvalids(): number[] {

        const oomLow = this._getOrderOfMagnitude(this.Low);
        const oomHigh = this._getOrderOfMagnitude(this.High);
        const oomLowOdd = oomLow % 2 !== 0;

        let initialDigit = 0;

        // const den = Math.pow(10, (oomLow + 1) / 2); // For debugging
        // const even = Math.pow(10, (oomLow) / 2); // For debugging

        if (oomLowOdd) {
            // Use actual initial digits in first half of number const den = Math.pow(10,(oom.Low+1)/2); // For debugging
            initialDigit = Math.floor(this.Low / Math.pow(10, (oomLow + 1) / 2));
        } else {
            // Use the next power of ten
            initialDigit = Math.pow(10, (oomLow) / 2);
        }

        const lastDigit = Math.pow(10, oomHigh) - 1;

        const invalids = [];
        for (let d = initialDigit; d <= lastDigit; d++) {
            const invalid = this._createInvalid(d);
            if (invalid > this.High) break;
            if (this.Contains(invalid)) {
                invalids.push(invalid);
            }

        }

        return invalids;
    }

    private _findFragments(): string[] {

        // divide low and high in half and get the range of first digits
        // Do this using the order of magnitude and trimming digits from the right side (a negative slice)

        const oomLow = this._getOrderOfMagnitude(this.Low);
        //const oomHigh = this._getOrderOfMagnitude(this.High);

        const countEndTrim = Math.floor((oomLow + 1) / 2);
        const str = {
            Low: this.Low.toString(),
            High: this.High.toString()
        };

        const firstHalf = {
            Low: Number(countEndTrim > 0 ? str.Low.slice(0, -countEndTrim) : str.Low),
            High: Number(countEndTrim > 0 ? str.High.slice(0, -countEndTrim) : str.High)
        };

        // within that range, slice all and add to a set

        const setFragments = new Set<string>();
        for (let i = firstHalf.Low; i <= firstHalf.High; i++) {
            const str = i.toString();
            for (let j = 1; j <= str.length; j++) {
                const strFragment = str.slice(0, j);
                if (strFragment === '0') {
                    console.error('0');
                }
                if (strFragment) {
                    setFragments.add(strFragment);
                }
            }
        }

        return [...setFragments];
    }

    findInvalids2(): number[] {

        //console.log(`findInvalids: ${this.Low}-${this.High}...`);
        const fragments: string[] = this._findFragments();

        const setInvalids = new Set<number>();
        for (let i = 0; i < fragments.length; i++) {
            const strFragment = fragments[i];
            let dRepeat = 0;
            let strRepeat = strFragment; // Must start with at least one fragment
            while (dRepeat < this.High) {
                strRepeat += strFragment; // Now there are at least two fragments
                dRepeat = Number(strRepeat);
                if (this.Contains(dRepeat)) {
                    setInvalids.add(dRepeat);
                }
            }
        }

        const invalids = [...setInvalids];
        //invalids.sort().forEach(i=>console.log(i)); // Debugging

        return invalids;
    }
}

function parse(input: string): ProductRange[] {
    const toInterval = (s: string): ProductRange => {
        const re: RegExp = /(\d+)-(\d+)/g;
        const matches = re.exec(s) || [];
        const numbers = matches.map(Number);
        return new ProductRange(numbers[1], numbers[2]);
    }

    return input
        .split(',')
        .map(toInterval);
};

export const part1 = async (input: string): Promise<number | string> => {
    const parsed: ProductRange[] = parse(input);

    let invalids = [];
    parsed.forEach(p => {
        invalids = invalids.concat(p.findInvalids());
    })
    const solution = invalids.reduce((total, cur) => total + cur, 0);
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed: ProductRange[] = parse(input);

    let invalids = [];
    parsed.forEach(p => {
        invalids = invalids.concat(p.findInvalids2());
    });
    const solution = invalids.reduce((total, cur) => total + cur, 0);
    return solution;
};
