//https://en.wikipedia.org/wiki/Least_common_multiple
export const LCM = (a: number, b: number): number => {
    return (a * b) / GCD(a, b);
}

export const GCD = (a: number, b: number): number => {
    for (let temp = b; b !== 0;) { // while loop instead?
        b = a % b;
        a = temp;
        temp = b;
    }
    return a;
}

// Stolen from:
// https://www.geeksforgeeks.org/introduction-to-chinese-remainder-theorem/
// I guess there's a more efficient algorithm too.
export const ChineseRemainder = (num: number[], rem: number[], k: number) => {
    let x = 1; // Initialize result

    // As per the Chinese remainder theorem,
    // this loop will always break.
    while (true) {
        // Check if remainder of x % num[j] is 
        // rem[j] or not (for all j from 0 to k-1)
        let j = 0
        for (; j < k; j++) {
            if (x % num[j] !== rem[j]) {
                break;
            }
        }

        // If all remainders matched, we found x
        if (j === k) {
            return x;
        }

        // Else try next number
        x++;
    }
}