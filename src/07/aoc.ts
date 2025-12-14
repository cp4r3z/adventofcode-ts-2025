import { ITreeMember } from "../common/trees/simple";

function parse(input: string) {

    const toSplitterPositions = (s: string): number[] => {
        let positions = [];
        let position = -1; // str.indexOf("e");
        do {
            position = s.indexOf("^", position + 1);
            if (position !== -1) positions.push(position);
        } while (position !== -1);
        return positions;
    }

    const notEmptyRow = (r: string): boolean => !r.split('').every(s => s === '.');

    const rows = input
        .split('\n');

    const first = rows.splice(0, 1);

    const positions = rows
        .filter(notEmptyRow)
        .map(toSplitterPositions);

    return { positions };
};

export const part1 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    let beams = parsed.positions[0];
    let splitCount = 0;
    for (let i = 0; i < parsed.positions.length; i++) {
        // Split into a new Set,
        const newBeams = new Set<number>();
        beams.forEach(beam => {
            if (parsed.positions[i].includes(beam)) {
                newBeams.add(beam + 1);
                newBeams.add(beam - 1);
                splitCount++;
            } else {
                newBeams.add(beam);
            }
        });
        beams = [...newBeams];
    }
    const solution = splitCount;
    return solution;
};

class Splitter implements ITreeMember {
    id: string;
    children: Splitter[] = [];
    _pathCache: number = null;

    constructor(public row: number, public pos: number) {
        this.id = `r${row}pos${pos}`;
    }

    equals(other: Splitter): boolean {
        throw new Error("Method not implemented.");
    }

    addChild(child: Splitter): Splitter {
        if (this.children.includes(child)) {
            console.warn('Child already added');
            return this;
        }
        this.children.push(child);
        return this;
    }

    possiblePaths(): number {
        if (this._pathCache !== null) return this._pathCache;
        this._pathCache = 2 - this.children.length; // May have 0, 1, or 2 "endpoints"
        this._pathCache += this.children.reduce((total, cur) => total + cur.possiblePaths(), 0);
        return this._pathCache;
    }

    print() {
        const children = this.children.map(c => c.id).join(',')
        console.log(`${this.id}=>${children}`);
    }
}

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    let start: Splitter;
    let beams = parsed.positions[0];
    let mapBeamToSplitters = new Map<number, Splitter[]>();
    let splitCount = 0;
    let splitters: Splitter[] = [];
    for (let i = 0; i < parsed.positions.length; i++) {
        // Split into a new Set,
        const newBeams = new Set<number>();
        beams.forEach(beam => {
            if (parsed.positions[i].includes(beam)) {
                // We hit another splitter.
                // Add child to above splitter
                const splitter = new Splitter(i, beam);
                splitters.push(splitter);

                if (mapBeamToSplitters.has(beam)) {
                    mapBeamToSplitters.get(beam).forEach(parent => {
                        parent.addChild(splitter);
                    });
                    mapBeamToSplitters.set(beam, []);
                } else {
                    // We should only get here once
                    start = splitter;
                }

                newBeams.add(beam + 1);
                newBeams.add(beam - 1);

                // add
                if (mapBeamToSplitters.has(beam + 1)) {
                    mapBeamToSplitters.get(beam + 1).push(splitter);
                } else {
                    mapBeamToSplitters.set(beam + 1, [splitter]);
                }
                if (mapBeamToSplitters.has(beam - 1)) {
                    mapBeamToSplitters.get(beam - 1).push(splitter);
                } else {
                    mapBeamToSplitters.set(beam - 1, [splitter]);
                }
                splitCount++;
            } else {
                newBeams.add(beam);
            }
        });
        beams = [...newBeams];
    }
    //splitters.forEach(s=>s.print());
    const solution = start.possiblePaths();
    return solution;
};
