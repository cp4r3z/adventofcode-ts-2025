import { INode, IGraph, PathfinderResult } from "../../types";

// TODO: Should each of these pathfinding algorithms have an interface?

/**
 * @class Depth First Search Pathfinding Algorithm
 * @remarks IGraph Implementation Agnostic
 */
export class DFS {

    public stack: INode[]; // TODO: does this need to be public?    
    public bestCost: number = Infinity;

    private _start: INode;
    private _end: INode;
    private _bestPath: INode[];

    private _nodeCostMap: Map<INode, number> = new Map();

    constructor(protected graph: IGraph) {
        this.stack = [];
        this._start = graph.start;
        //this._end = graph.end; // could be a problem
    }

    // setBestPath(path:INode[]){

    // }

    /**
     * Compare two paths
     * @remarks By default, it's just shorter = better
     */
    private _pathComparator = (): boolean => {
        const candidateCost = this.pathCost(this.stack);

        if (this._bestPath === null) {
            this._bestPath = [...this.stack];
            if (this.bestCost === Infinity) {
                this.bestCost = candidateCost;
            }
            return true;
        }
        //const currentCost = this.pathCost(current);
        //  const candidateCost = this.pathCost(candidate) ;

        const better = candidateCost < this.bestCost;

        if (better) {
            this.bestCost = candidateCost;
            // Make a copy of the stack and return 
            this._bestPath = [...this.stack];
            console.log(`Better Path Found, Cost = ${this.bestCost}`);

        }

        return better;
    }

    public pathCost = (path: INode[]): number => {
        return path.length - 1;
    }

    // Useful for filtering out walls, for example
    public neighborFilter = (node: INode) => true;// !this.stack.includes(node);

    public neighborSort = (nodeA: INode, nodeB: INode) => 1;

    // start by popping a node from the end of the stack. why pop though?

    // for a node, find neighbors.
    // if any of those neighbors is IN the stack, filter it    
    // if there is one neighbor, add to stack,
    // if more than one, branch.
    // - start by storing the last stack index
    // - then, for each, add that 

    findPath(start?: INode, end?: INode): PathfinderResult {
        if (start) this._start = start;
        this.stack = [this._start];
        if (end) this._end = end;
        this._bestPath = null;

        this._dfs();

        const path = this._bestPath;
        const cost = this.bestCost;

        return { path, cost };
    }

    private _dfs() {
        let current = this.stack[this.stack.length - 1];

        // Have we been here before?
        // I think that we need to record this at the end,
        // then if we've been here before, we add the cost so far
        // to the known best cost going forward.
        // orientation probably matters for grid2d...
        const currentCost = this.pathCost(this.stack);
        if (this._nodeCostMap.has(current)) {
            const previousCost = this._nodeCostMap.get(current);
            if (previousCost <= currentCost) {
                return;
            }
        }

        if (this._bestPath?.length > 0) {
            //const bestCost = this.pathCost(this._bestPath);
            if (currentCost >= this.bestCost) {
                return;
            }
        }

        this._nodeCostMap.set(current, currentCost);

        const startingStackLength = this.stack.length;
        let branch = false;
        let neighbors: INode[] = [];
        while (!branch) {
            current = this.stack[this.stack.length - 1];

            if (current === this._end) {
                // Is the current stack "better" than the current "best" path?
                // I'm not sure we need to do the pathcomparator anymore...
                this._pathComparator();
                this.stack.length = startingStackLength; // Always do this before exiting function.
                return;
            }

            neighbors = this.graph
                .getNeighbors(current)
                // .filter(n => n && !this.stack.includes(n)) // Prevents circular paths. Might be too restrictive?
                .filter(this.neighborFilter);
            //.filter(n => n && this.stack[this.stack.length - 2] !== n);
            if (neighbors.length === 1) {
                // Only one option. No need to add to call stack.
                this.stack.push(neighbors[0]);
            } else if (neighbors.length > 1) {
                branch = true;
            } else {
                this.stack.length = startingStackLength;
                return;
            }
        }

        // sort neighbors so we evaluate the cheapest path first

        // neighbors.sort((neighborA: INode, neighborB: INode) => {
        //     this.stack.push(neighborA);
        //     const costA = this.pathCost(this.stack);
        //     //this._dfs();
        //     this.stack.pop();
        //     this.stack.push(neighborB);
        //     const costB = this.pathCost(this.stack);
        //     this.stack.pop();
        //     return costA - costB;// ? -1 : 1;
        // });

        // neighbors.sort(this.neighborSort);

        neighbors.forEach((neighbor: INode) => {
            this.stack.push(neighbor);
            this._dfs();
            this.stack.pop();
        });

        // Reset the stack length
        this.stack.length = startingStackLength; // This is an interesting way to do it
    }
}

// TODO: MOVE THIS TO bfs.ts
/**
 * @class Breadth First Search Pathfinding Algorithm
 * @remarks IGraph Implementation Agnostic
 */
export class BFS {

    findPath(start: INode, end: INode): PathfinderResult {

        const path = [];
        const cost = Infinity;

        // we need a 

        return { path, cost };

    }

}

