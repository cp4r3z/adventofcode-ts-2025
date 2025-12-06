import { INode, IGraph } from '../types';

import * as Points from "../base/points";
import * as Shapes from "../base/shapes";
import { Direction } from './Direction';

const { createHash } = await import('node:crypto');

export interface IGrid2D {
    //TODO
}

export type GridOptions = {
    setOnGet: boolean,
    defaultValue: any
}

export type String2DOptions = {
    parseInt?: boolean
    startString?: string,
    endString?: string
}

export type PrintOptions = {
    yDown?: boolean,
    path?: Points.IPoint2D[]
}

export class GridPoint extends Points.XY implements INode {
    public Value: any;
    public Orientation: Direction.Cardinal = null;

    constructor(x: number, y: number, value: any) {
        super(x, y);
        this.Value = value;
    }

    moveTo(point: Points.IPoint2D) {
        this.x = point.x;
        this.y = point.y;
    }

    print():string { return this.Value; }
    override toString = () => `x:${this.x}, y:${this.y} = ${this.Value}`;

    clone(): GridPoint {
        const cloned = new GridPoint(this.x, this.y, this.Value);
        cloned.Orientation = this.Orientation;
        return cloned;
    }
}

// Warning: Do not use the native Map set() function
export class Grid2D extends Map<string, GridPoint> implements IGraph {
    static HashPointToKey = (p: Points.IPoint2D): string => Grid2D.HashXYToKey(p.x, p.y);  //`X${p.x}Y${p.y}`; // maybe do some validation?
    static HashXYToKey = (x: number, y: number): string => `X${x}Y${y}`;
    static ReKey: RegExp = new RegExp(/([\-\d]+)/, 'g');
    static HashKeyToXY = (hash: string): Points.IPoint2D => {
        const matches = hash.match(Grid2D.ReKey);
        return new Points.XY(parseInt(matches[0]), parseInt(matches[1]));
    }

    protected bounds: Shapes.Rectangle = null;

    protected readonly options: GridOptions = {
        setOnGet: true,
        defaultValue: ' ' // or null?
    }

    protected _neighborCache: Map<GridPoint, GridPoint[]>;

    constructor(options?: GridOptions) {
        super();
        if (options) this.options = options;
        this._neighborCache = new Map();
    }

    clear() {
        super.clear();
        this.bounds = null;
    }

    // TODO: delete, has

    getPoint = (point: Points.IPoint2D): GridPoint | null => {
        const hash: string = Grid2D.HashPointToKey(point);

        let value: GridPoint = this.get(hash);

        if (typeof (value) === 'undefined') {
            value = null;
            if (this.options.setOnGet) {
                value = this.options.defaultValue;
                this.set(hash, this.options.defaultValue);
            }
        }
        return value;
    };

    getXY = (x: number, y: number): any => {
        const hash: string = Grid2D.HashXYToKey(x, y);
        let value: any = this.get(hash);

        if (typeof (value) === 'undefined') {
            value = null;
            if (this.options.setOnGet) {
                value = this.options.defaultValue;
                this.set(hash, this.options.defaultValue);
            }
        }
        return value;
    };

    expandBounds = (point: Points.IPoint2D): void => {
        if (!this.bounds) {
            // Should only happen once
            this.bounds = new Shapes.Rectangle(point, point);
        }
        // Keep record of the overall dimensions
        // I wonder if this should be a special kind of shape!
        // Perhaps we can extend Rectangle to have an Expand method?
        if (point.x < this.bounds.minX) {
            this.bounds = new Shapes.Rectangle(new Points.XY(point.x, this.bounds.x0y0.y), this.bounds.x1y1);
        }
        else if (point.x > this.bounds.maxX) {
            this.bounds = new Shapes.Rectangle(this.bounds.x0y0, new Points.XY(point.x, this.bounds.x1y1.y));
        }
        if (point.y < this.bounds.minY) {
            this.bounds = new Shapes.Rectangle(new Points.XY(this.bounds.x0y0.x, point.y), this.bounds.x1y1);
        }
        else if (point.y > this.bounds.maxY) {
            this.bounds = new Shapes.Rectangle(this.bounds.x0y0, new Points.XY(this.bounds.x1y1.x, point.y));
        }
    };

    setGridPoint = (point: GridPoint): void => this.setPoint(point, point);

    setPoint = (point: Points.IPoint2D, value: any): void => {
        const hash: string = Grid2D.HashPointToKey(point);

        this.expandBounds(point);

        this.set(hash, value);
    };

    moveGridPointTo(point: GridPoint, to: Points.IPoint2D) {
        const toKey: string = Grid2D.HashPointToKey(to);
        // Check for existing
        if (this.has(toKey)) {
            console.warn(`moveGridPointTo: Point Occupied!`);
        }
        this.deletePoint(point);
        point.moveTo(to);
        this.setGridPoint(point);
    }

    // TODO: SetFrom2DString, but give it a type?

    /**
     * Assumes that this is a string representing a grid.
     * Rows are separated by returns \n
     */
    setFromString2D = (input: string, options?: String2DOptions) => {
        input
            .split('\n')
            .forEach((row, y) => {
                row.split('').forEach((s, x) => {
                    let val: any = s;
                    if (options?.parseInt) {
                        val = parseInt(s);
                    }
                    if (val !== this.options?.defaultValue) {
                        const gridPoint = new GridPoint(x, y, val)
                        this.setGridPoint(gridPoint);
                        if (val === options?.startString) {
                            this.start = gridPoint;
                        } else if (val === options?.endString) {
                            this.end = gridPoint;
                        }
                    } else {
                        this.expandBounds(new Points.XY(x, y));
                    }
                });
            });
    };

    // Returns the value at the deleted key (point)
    deletePoint = (point: Points.IPoint2D): any => {
        const hash: string = Grid2D.HashPointToKey(point);
        let value: any = this.get(hash);
        if (!value) {
            return null;
        }
        this.delete(hash);
        //console.warn('TODO: Optionally Update Bounds');
        return value;
    };

    getValueArray(): GridPoint[] {
        const mapArr = [...this]; // array of arrays
        const valArr = mapArr.map(([key, value]) => value);
        return valArr;
    }

    getBounds = () => this.bounds;
    setBounds = (r: Shapes.Rectangle) => {
        this.bounds = r;
    }

    getEdgePoints = (): Points.IPoint2D[] => {
        const points: Points.IPoint2D[] = [];
        // Top & Bottom
        for (let x = this.bounds.minX; x <= this.bounds.maxX; x++) {
            points.push(new Points.XY(x, this.bounds.minY));
            points.push(new Points.XY(x, this.bounds.maxY));
        }
        // Left & Right
        for (let y = this.bounds.minY + 1; y < this.bounds.maxY; y++) {
            points.push(new Points.XY(this.bounds.minX, y));
            points.push(new Points.XY(this.bounds.maxX, y));
        }
        return points;
    }

    inBounds = (p: Points.IPoint2D): boolean => {
        return this.bounds.hasPoint(p);
    }

    getOptions = () => this.options;

    // Deprecated
    hashOld = () => {
        // maybe find something smaller?
        let hash = '';
        for (let y = this.bounds.minY; y <= this.bounds.maxY; y++) {
            hash += 'l';
            //let line = '';
            for (let x = this.bounds.minX; x <= this.bounds.maxX; x++) {
                const key = Grid2D.HashXYToKey(x, y);
                let value = this.get(key);
                if (typeof (value) === 'undefined') {
                    value = null;
                    if (this.options.setOnGet) {
                        value = this.options.defaultValue;
                        this.set(key, this.options.defaultValue);
                    }
                }
                hash += value;
            }
        }
        return hash;
    }

    hash = (useCrypto: boolean = true) => {
        let hash = '';
        for (let [k, v] of this.entries()) {
            hash += `k${k}`;
            //console.log(k, v);
            if (typeof v === 'string') {
                hash += `v${v}`;
            } else if (v.print) {
                hash += `v${v.print()}`;
            } else if (v.toString) {
                hash += `v${v.toString()}`;
            } else {
                hash += `v${v}`;
            }
        }
        if (!useCrypto) {
            return hash;
        }

        const cryptoHash = createHash('sha1');
        const digest = cryptoHash.update(hash).digest('base64');
        return digest;
    }

    addBorder = (value?: any) => {
        const bounds = new Shapes.Rectangle(
            new Points.XY(this.bounds.minX - 1, this.bounds.minY - 1),
            new Points.XY(this.bounds.maxX + 1, this.bounds.maxY + 1));

        if (value === undefined) {
            //this.setBounds(bounds);
            value = this.options.defaultValue;
        }

        // Top & Bottom
        for (let x = bounds.minX; x <= bounds.maxX; x++) {
            this.setGridPoint(new GridPoint(x, bounds.minY, value));
            this.setGridPoint(new GridPoint(x, bounds.maxY, value));
        }
        // Sides
        for (let y = bounds.minY + 1; y <= bounds.maxY - 1; y++) {
            this.setGridPoint(new GridPoint(bounds.minX, y, value));
            this.setGridPoint(new GridPoint(bounds.maxX, y, value));
        }
    }

    // #region IGraph Implementation

    public start: GridPoint = null;
    public end: GridPoint = null;

    getNeighbors(point: GridPoint): GridPoint[] {
        let neighbors:GridPoint[] = this._neighborCache.get(point);
        if (Array.isArray(neighbors)) {
            return neighbors;
        }

        // neighbors = Direction.Cardinals.map((c: Direction.Cardinal) => {
        //     const xy: Points.IPoint2D = Direction.CardinalToXY.get(c);
        //     const neighbor: Points.IPoint2D = point.copy().move(xy);
        //     const p = this.getPoint(neighbor); // Warning! Is setOnGet true?
        //     if (!p) return null;
        //     if (!this.bounds.hasPoint(p)) return null;
        //     // p.Orientation = c; // ah, no this will set the orientation for the same point multiple times.
        //     return p;
        // });

        neighbors = [];
        Direction.Cardinals.forEach((c: Direction.Cardinal) => {
            const xy: Points.IPoint2D = Direction.CardinalToXY.get(c);
            const neighbor: Points.IPoint2D = point.copy().move(xy);
            const p = this.getPoint(neighbor); // Warning! Is setOnGet true?
            if (!p) return;
            if (!this.bounds.hasPoint(p)) return;
            // p.Orientation = c; // ah, no this will set the orientation for the same point multiple times.
            neighbors.push(p);
        });

        this._neighborCache.set(point, neighbors);

        return neighbors;
    }

    getWeight(from: Points.IPoint2D, to: Points.IPoint2D): number {
        // I'm not sure if this is right, but we need something...
        return Points.XY.ManhattanDistance(from, to);
    }

    print = (options?: PrintOptions) => {
        let yDown = true;
        let path: Points.IPoint2D[] = [];
        if (options?.hasOwnProperty('yDown')) yDown = options.yDown;
        if (options?.hasOwnProperty('path')) path = options.path;

        // convert path to hashes...
        const pathHash = path.map(point => Grid2D.HashPointToKey(point));

        const printLine = (y: number) => {
            let line = '';
            for (let x = this.bounds.minX; x <= this.bounds.maxX; x++) {
                const key = Grid2D.HashXYToKey(x, y);
                let s:string = this.options.defaultValue;

                let value = this.get(key);                
                if (typeof (value) === 'undefined') {
                    //value = this.options.defaultValue;
                    if (this.options.setOnGet) {
                        this.set(key, value);
                    }
                }
                if (value?.print) {
                    s = value.print();
                    // if (value === undefined) {
                    //     value = this.options.defaultValue;
                    // }
                }
                if (pathHash.includes(key)) {
                    s = 'O'; // Or some other path character
                }

                line += s;
            }
            console.log(line);
        }

        if (yDown) {
            for (let y = this.bounds.minY; y <= this.bounds.maxY; y++) {
                printLine(y);
            }
        } else {
            for (let y = this.bounds.maxY; y >= this.bounds.minY; y--) {
                printLine(y);
            }
        }
    }

    // forEach(callbackfn: (value: GridPoint, key: string, map: Map<string, GridPoint>) => void, thisArg?: any): void {
    //     super.forEach(callbackfn);
    // }

    forEach(callbackfn: (node: GridPoint, key:string, map: Map<string, GridPoint>) => void, thisArg?: any): void {
        super.forEach(callbackfn);
    }

    isEnd(point:GridPoint): boolean {
        return point === this.end;
    }

    // #endregion
}

export class Grid3D extends Map<string, any> {
    static HashPointToKey = (p: Points.IPoint3D): string => `X${p.x}Y${p.y}Z${p.z}`; // maybe do some validation?
    static HashXYToKey = (x: number, y: number, z: number): string => `X${x}Y${y}Z${z}`;
    static HashToPoint = (h: string): Points.IPoint3D => {
        const matches = h.match(/(-?\d+)/g);
        return new Points.XYZ(parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2]));
    }

    public Bounds: Shapes.RectangularPrismBounds = null;

    private readonly options: GridOptions = {
        setOnGet: false,
        defaultValue: ' ' // or null?
    }

    constructor(options?: GridOptions) {
        super();
        if (options) this.options = options;
    }

    // TODO: delete, has

    getPoint = (point: Points.IPoint3D): any => {
        const hash: string = Grid3D.HashPointToKey(point);

        let value: any = this.get(hash);

        if (typeof (value) === 'undefined') {
            value = null;
            if (this.options.setOnGet) {
                value = this.options.defaultValue;
                this.set(hash, this.options.defaultValue);
            }
        }
        return value;
    }

    setPoint = (point: Points.IPoint3D, value: any): void => {
        if (!this.Bounds) {
            // Should only happen once
            this.Bounds = new Shapes.RectangularPrismBounds(point, point);
        }

        const hash: string = Grid3D.HashPointToKey(point);
        this.set(hash, value);
        this.Bounds.Expand(point);
    }

    //TODO: Print!
}