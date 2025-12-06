import { INode, IGraph, PathfinderResult } from "../../types";

/**
 * @class Dijkstra's Pathfinding Algorithm
 * @remarks IGraph Implementation Agnostic
 * Dijkstra's algorithm
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class Dijkstra {

    // The prev array contains pointers to previous-hop nodes on the shortest path from source to the given vertex 
    public prev: Map<INode, INode[]> = new Map();
    public ends: Set<INode> = new Set();

    // dist is an array that contains the current distances from the source to other vertices
    private _dist: Map<INode, number> = new Map();

    //public get dist(): Map<INode, number> { return this._dist };
    //public get prev(): Map<INode, INode> { return this._prev }; 

    private _Q: Set<INode> = new Set(); // TODO: Is there a better way? Wikipedia said something about a priority queue

    /**
     * @param graph 
     */
    constructor(public graph: IGraph) {
        this.graph.forEach(node => {
            this._dist.set(node, Infinity);
            this.prev.set(node, []);
            this._Q.add(node);
        });

        this._dist.set(this.graph.start, 0);

        while (this._Q.size) {
            // The code u ← vertex in Q with min dist[u], searches for the vertex u in the vertex set Q that has the least dist[u] value
            const u: INode = this._distMin();
            if (this.graph.isEnd(u)) {
                this.ends.add(u); // Add to the set of ends
                break; // Remove this if we want to search the entire graph
            }
            this._Q.delete(u);

            for (const v of this.graph.getNeighbors(u)) {
                // dist[u] is the current distance from the source to the vertex u
                // The variable alt on line 14 is the length of the path from the source node to the neighbor node v if it were to go through u.
                const alt = this._dist.get(u) + this.graph.getWeight(u, v);
                // If this path is shorter than the current shortest path recorded for v, then the distance of v is updated to alt.
                if (alt < this._dist.get(v)) {
                    this._dist.set(v, alt);
                    this.prev.set(v, [u]);
                } else if (alt === this._dist.get(v)) {
                    const prevV = this.prev.get(v);
                    prevV.push(u);
                }
            }
        }
    }

    _distMin(): INode {
        const it: IterableIterator<INode> = this._Q.values();
        let result = it.next();
        let min: INode = result.value;
        let minDist = this._dist.get(min)
        while (!result.done) {
            const value: INode = result.value;
            const valueDist = this._dist.get(value);
            if (valueDist < minDist) {
                min = value;
                minDist = valueDist;
            }
            result = it.next();
        }
        return min;
    }

    // TODO
    // findPath(start: INode, end: INode): PathfinderResult {
    //     return { path, cost };
    // }

    // Assumes that graph has a start and end property
    // TODO: Consider accepting an end/target property
    findMinPaths() {
        const S: INode[][] = [];

        this.ends.forEach(end => {
            let path: INode[] = [end];
            const dfsPath = (target: INode) => {
                if (target === this.graph.start) {
                    // add the path sequence to the array
                    S.push(path.slice().reverse());
                    return;
                }
                const prevs = this.prev.get(target);
                for (const p of prevs) {
                    path.push(p);
                    dfsPath(p); // Recursion
                    path.pop();
                }
            }
            dfsPath(end);
        });

        return S;
    }
}
