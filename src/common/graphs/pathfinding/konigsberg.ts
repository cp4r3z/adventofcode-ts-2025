/**
 * The Seven Bridges of Königsberg is a famous historical problem in graph theory. It can be modeled using a graph where:
 * 
 * Nodes (vertices) represent land masses.
 * Edges represent bridges between land masses.
 * 
 * Euler proved it's not possible to walk through the city crossing each bridge exactly once — because it doesn't have an Eulerian path.
 */

import { INode, IGraph, IEdge } from '../../types';

class Land implements INode {
    constructor(public id: string) { }

    equals(other: INode): boolean {
        return this === other; // memory location
    }
}

class Bridge implements IEdge {
    from: Land;
    to: Land;
    // weight?: number | undefined;
    // id?: string | undefined;
    bidirectional: boolean = true;
    constructor(land: [Land, Land], public weight: number, public id: string) {
        this.from = land[0];
        this.to = land[1];
    }
}

const llString = (l0: Land, l1: Land): string => `${l0.id},${l1.id}`;

// TODO: This is all ... kinda silly. Konigsberg should just be a single example of a Graph
export class Konigsberg implements IGraph {

    private _neighbors: Map<Land, Land[]> = new Map();
    private _weights: Map<string, number> = new Map();
    private _lands: Land[];

    constructor(land: Land[], bridges: Bridge[]) {
        this._lands = land;
        this.start = land[0]; // A
        this.end = land[1]; // B

        land.forEach(l => this._neighbors.set(l, []));
        bridges.forEach(b => {

            // Populate this._neighbors
            const from: Land[] = this._neighbors.get(b.from) as Land[];
            if (!from.includes(b.to)) {
                from.push(b.to);
            }
            if (b.bidirectional) {
                const to: Land[] = this._neighbors.get(b.to) as Land[];
                if (!to.includes(b.from)) {
                    to.push(b.from);
                }
            }

            // Populate this._weights
            const keyToFrom = llString(b.to, b.from);
            let weight = this._weights.get(keyToFrom) || Infinity;
            if (b.weight < weight) {
                this._weights.set(keyToFrom, b.weight);
            }
            if (b.bidirectional) {
                const keyFromTo = llString(b.from, b.to);
                weight = this._weights.get(keyFromTo) || Infinity;
                if (b.weight < weight) {
                    this._weights.set(keyFromTo, b.weight);
                }
            }
        });
    }

    // #region IGraph Implementation
    public start: Land;
    public end: Land;

    getNeighbors(land: Land): Land[] {
        return this._neighbors.get(land) || [];
    }
    getWeight(from: Land, to: Land): number {
        return this._weights.get(llString(from, to)) || 0;
    }
    forEach(callbackfn: (value: INode) => void, thisArg?: any): void {
        this._lands.forEach(callbackfn);
    }
    isEnd(node: Land): boolean {
        return node === this.end;
    }
    print() {
        throw new Error('Method not implemented.');
    }
    // #endregion    

}

// Königsberg graph (A, B, C, D = land masses)

//        🟩 North Bank (A)
//     /   |     \
//    /    |           \
//  (1)🌉 |                \
//    \   (2)🌉               (3)🌉
//     \   |                        \
//        🟦 Island 1 (C) —— (4)🌉—— 🟪 Island 2 (D)
//     /   |                        /
//    /   (6)🌉               (7)🌉
//   (5)🌉 |               /
//    \    |           /
//     \   |     /
//        🟨 South Bank (B)

// const konigsbergGraph = {
//     //   1    2    3
//     A: ['C', 'C', 'D'],  // A is connected to C (twice) and D
//     //   4
//     C: ['D'],            // C is connected D
//     //   5    6    7
//     B: ['C', 'C', 'D'],  // B is connected to C (twice) and D
// };

const konigsbergLands = ['A', 'B', 'C', 'D'];
const konigsbergBridges = [
    { id: '1', lands: ['A', 'C'], weight: 1 },
    { id: '2', lands: ['A', 'C'], weight: 10 },
    { id: '3', lands: ['A', 'D'], weight: 5 },
    { id: '4', lands: ['C', 'D'], weight: 3 },
    { id: '5', lands: ['B', 'C'], weight: 4 },
    { id: '6', lands: ['B', 'C'], weight: 10 },
    { id: '7', lands: ['B', 'D'], weight: 1 }
];

const landsMap: Map<string, Land> = new Map();
konigsbergLands.forEach(id => landsMap.set(id, new Land(id)));

const bridges: Bridge[] = konigsbergBridges.map(b => {
    const land: [Land, Land] = [
        landsMap.get(b.lands[0]) as Land,
        landsMap.get(b.lands[1]) as Land
    ];
    return new Bridge(land, b.weight, b.id);
});

const land = [...landsMap.values()];

export const konigsberg = new Konigsberg(land, bridges);
