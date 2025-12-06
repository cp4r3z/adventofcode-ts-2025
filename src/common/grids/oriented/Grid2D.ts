//import {Grid2D as superGrid2D} from '../grid';
import { IGraph, INode } from '../../types';
import { Direction } from '../Direction';
import * as Points from "../../base/points";

export const Hash = {
    // PointToKey: (p: Points.IPoint2D): string => `${p.x},${p.y}`,
    XYOToKey: (x: number, y: number, o: Direction.Cardinal): string => `${x},${y},${o}`,
    // ReKey: new RegExp(/([\-\d]+)/, 'g'),
    // HashKeyToXY: (hash: string): Points.IPoint2D => {
    //     const matches = hash.match(hash.ReKey);
    //     return new Points.XY(parseInt(matches[0]), parseInt(matches[1]));
    // }
};

export class GridPoint extends Points.XY implements INode {

    constructor(x: number, y: number, public readonly orientation:Direction.Cardinal, public value: any) {
        super(x, y);    
    }

    getKey(): string {
        return Hash.XYOToKey(this.x, this.y, this.orientation);
    }

    // moveTo(point: Points.IPoint2D) {
    //     this.x = point.x;
    //     this.y = point.y;
    // }

    print():string { return this.value; }
    override toString = () => `x:${this.x}, y:${this.y} = ${this.value}`; // TODO Add Orientation?

    clone(): GridPoint {
        return new GridPoint(this.x, this.y, this.orientation, this.value);
    }
}

export type GridOptions = {
    setOnGet: boolean,
    defaultValue: string|null
}

export type ParseOptions = {
    parseInt?: boolean
    startString?: string,
    startOrientation?: Direction.Cardinal,
    endString?: string,
    ignoreStrings?: string[],
    gridOptions?: GridOptions
}

//export class Grid2D extends superGrid2D implements IGraph {
export class Grid2D extends Map<string, GridPoint> implements IGraph {

    static parse = (input: string, options?: ParseOptions):Grid2D => {
        const grid = new Grid2D(options?.gridOptions);
        input
            .split('\n')
            .forEach((row, y) => {
                row.split('').forEach((s, x) => {
                    if (options?.ignoreStrings?.includes(s)) {
                        return; // Skip ignored strings
                    }
                    let val: any = s;
                    if (options?.parseInt) {
                        val = parseInt(s);
                    }
                    const created = grid.setXY(x, y, val);
                    if (val === options?.endString) {
                        grid.ends = created;
                    }
                    if (val === options?.startString && options?.startOrientation) {
                        grid.start = created.find(point=>point.orientation === options.startOrientation)!; // asserts non-null                        
                    }
                });
            });
            return grid;
    };

    public start: GridPoint;
    public ends: GridPoint[];

    protected readonly options: GridOptions = {
        setOnGet: true,
        defaultValue: ' ' // or null?
    }
    protected neighborCache: Map<GridPoint, GridPoint[]>;

    constructor(options?: GridOptions) {
        super();
        if (options) {
            this.options = options;
        }
        this.neighborCache = new Map();
    }    

    // clear() {
    //     super.clear();
    //     //this.bounds = null;
    // }

    //private nodes: Map<string, INode> = new Map();

    setPoint(point: GridPoint): void {
        // Check if exists?
        this.set(point.getKey(), point);
    }

    setXY(x: number, y: number, value: any): GridPoint[] {
        const created:GridPoint[] = []; 
        Direction.Cardinals.forEach((orientation: Direction.Cardinal) => {
            const key = Hash.XYOToKey(x, y, orientation);        
            const point = new GridPoint(x, y, orientation, value);            
            created.push(point);
            this.set(key, point);
            
        });
        return created;
    }

    getXYO(x: number, y: number, orientation: Direction.Cardinal): GridPoint|undefined {
        const key = Hash.XYOToKey(x, y, orientation);
        if (this.has(key)) {
            return this.get(key)!; // asserts non-null
        } else if (this.options.setOnGet) {
            const newPoint = new GridPoint(x, y, orientation, this.options.defaultValue);
            this.set(key, newPoint);
            return newPoint;
        } else {
            return undefined;
        }
    }

    getNeighbors(point: GridPoint): GridPoint[] {
        if (this.neighborCache.has(point)) {
            return this.neighborCache.get(point)!; // asserts non-null
        }

        // We assume initially that we can go forward or turn 90 degrees
        const oIndex = Direction.Cardinals.indexOf(point.orientation);
        const directions:Direction.Cardinal[] = [
            point.orientation, // Forward
            Direction.Cardinals[(oIndex + 1) % 4], // Right
            Direction.Cardinals[(oIndex + 3) % 4]  // Left
        ];
        const neighbors:GridPoint[] = directions
        .map(direction=>{
            const d:Points.XY = Direction.CardinalToXY.get(direction)!;
            //const neighborKey = Hash.XYOToKey(node.x + d.x, node.y + d.y, direction);
            return this.getXYO(point.x + d.x, point.y + d.y, direction);
        })
        .filter(n => n !== undefined) as GridPoint[]; // Filter out undefined values

        this.neighborCache.set(point, neighbors);
        return neighbors;
    }

    getWeight(from: GridPoint, to: GridPoint): number {
        // Assuming weight is always 1 for simplicity
        return 1;
    }

    print = () =>{
        console.log('TODO');
    }

    isEnd(point:GridPoint): boolean {   
        return this.ends.includes(point);
    }

    // print = (options?: PrintOptions) => {
    //     let yDown = true;
    //     let path: Points.IPoint2D[] = [];
    //     if (options?.hasOwnProperty('yDown')) yDown = options.yDown;
    //     if (options?.hasOwnProperty('path')) path = options.path;

    //     // convert path to hashes...
    //     const pathHash = path.map(point => Grid2D.HashPointToKey(point));

    //     const printLine = (y: number) => {
    //         let line = '';
    //         for (let x = this.bounds.minX; x <= this.bounds.maxX; x++) {
    //             const key = Grid2D.HashXYToKey(x, y);
    //             let s:string = this.options.defaultValue;

    //             let value = this.get(key);                
    //             if (typeof (value) === 'undefined') {
    //                 //value = this.options.defaultValue;
    //                 if (this.options.setOnGet) {
    //                     this.set(key, value);
    //                 }
    //             }
    //             if (value?.print) {
    //                 s = value.print();
    //                 // if (value === undefined) {
    //                 //     value = this.options.defaultValue;
    //                 // }
    //             }
    //             if (pathHash.includes(key)) {
    //                 s = 'O'; // Or some other path character
    //             }

    //             line += s;
    //         }
    //         console.log(line);
    //     }

    //     if (yDown) {
    //         for (let y = this.bounds.minY; y <= this.bounds.maxY; y++) {
    //             printLine(y);
    //         }
    //     } else {
    //         for (let y = this.bounds.maxY; y >= this.bounds.minY; y--) {
    //             printLine(y);
    //         }
    //     }
    // }

    // forEach(callbackfn: (value: GridPoint, key: string, map: Map<string, GridPoint>) => void, thisArg?: any): void {
    //     super.forEach(callbackfn);
    // }

    forEach(callbackfn: (node: GridPoint, key:string, map: Map<string, GridPoint>) => void, thisArg?: any): void {
        super.forEach(callbackfn);
    }

    
    // getNeighbors(node: INode): INode[] {
    //     throw new Error('Method not implemented.');
    // }
    // getWeight(from: INode, to: INode): number {
    //     throw new Error('Method not implemented.');
    // }
    // forEach(callbackfn: (value: INode) => void, thisArg?: any): void {
    //     throw new Error('Method not implemented.');
    // }
    // print() {
    //     throw new Error('Method not implemented.');
    // }

    

    // Helper method to create a unique key for each node
    private getKey(x: number, y: number, z: number, direction: string): string {
        return `${x},${y},${z},${direction}`;
    }
}
