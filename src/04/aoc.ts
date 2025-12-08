import { Grid2D, GridPoint } from "../common/grids/grid";

class Department extends Grid2D {
    findAccessible(): GridPoint[] {
        const accessible = [];
        const self = this;
        self.forEach(function (node) {
            if (node.Value !== '@') return;
            const neighbors = self.getNeighbors(node, true);
            const emptyNeighbors = neighbors.filter(function (node) {
                return node.Value === self.getOptions().defaultValue;
            });
            if (emptyNeighbors.length > 4) {
                accessible.push(node);
            }
        });
        return accessible;
    }
}

export const part1 = async (input: string): Promise<number | string> => {
    const dept = new Department({ setOnGet: true, defaultValue: '.' });
    dept.setFromString2D(input);
    dept.addBorder();
    //dept.print();
    const accessible = dept.findAccessible();
    const solution = accessible.length;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const dept = new Department({ setOnGet: true, defaultValue: '.' });
    dept.setFromString2D(input);
    dept.addBorder();
    //dept.print();
    // For Part 2, we're asked to keep removing accessible nodes until no longer possible
    let totalRolls = 0;
    let accessible: GridPoint[] = [];
    do {
        accessible = dept.findAccessible();
        accessible.forEach(r => r.Value = '.');
        totalRolls += accessible.length;

    } while (accessible.length > 0);

    const solution = totalRolls;
    return solution;
};
