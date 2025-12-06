import * as Point from "./points"
import { XYZ } from "./points";
import { Vector3 } from "./vectors";

export class Line2D {

    // TODO: Maybe take an optional parameter to specify infinite lines?
    public static Intersects = (L0: Line2D, L1: Line2D): Point.IPoint2D | null => {

        // Line L0 represented as a1x + b1y = c1
        const a1 = L0._p1.y - L0._p0.y;
        const b1 = L0._p0.x - L0._p1.x;
        const c1 = a1 * (L0._p0.x) + b1 * (L0._p0.y);

        // Line L1 represented as a2x + b2y = c2
        const a2 = L1._p1.y - L1._p0.y;
        const b2 = L0._p0.x - L1._p1.x;
        const c2 = a2 * (L1._p0.x) + b2 * (L1._p0.y);

        const determinant = a1 * b2 - a2 * b1;

        if (determinant == 0) {
            return null;
        }

        const x = (b2 * c1 - b1 * c2) / determinant;
        const y = (a1 * c2 - a2 * c1) / determinant;
        return new Point.XY(x, y);
    }

    _p0: Point.XY;
    _p1: Point.XY;

    // Order doesn't matter
    constructor(p0: Point.IPoint2D, p1?: Point.IPoint2D) {
        if (p0 && !p1) {
            // Point
            this._p0 = p0.copy();
            this._p1 = p0.copy();
            return;
        }
        this._p0 = p0.copy();
        this._p1 = p1.copy();
    }

    toString = () => `(${this._p0.x},${this._p0.y})->(${this._p1.x},${this._p1.y})`;
}

export class Line3D {

    _p0: Point.XYZ;
    _p1: Point.XYZ;

    // Order doesn't matter
    constructor(p0: Point.IPoint3D, p1?: Point.IPoint3D) {
        if (p0 && !p1) {
            // Point
            this._p0 = p0.copy();
            this._p1 = p0.copy();
            return;
        }
        this._p0 = p0.copy();
        this._p1 = p1.copy();
    }

    //TODO: Getters?

    toString = () => `(${this._p0.x},${this._p0.y},${this._p0.z})->(${this._p1.x},${this._p1.y},${this._p0.z})`;
}

/**
 * direction from an origin
 * 
 * Stores references, not copies
 * 
 * In THREE.js, you could also use Line3
 */
export class Ray3 {
    constructor(public origin: XYZ, public direction: Vector3) {
        // TODO: Should we normalize the direction?
    }

    /**
     * Intersection documentation:
     * https://www.songho.ca/math/line/line.html#example_lineline
     * 
     * Reference2: Intersection of two lines in three-space, Ronald Goldman, Graphics Gems, page 304, 1990
     */

    intersect(r2: Ray3): XYZ {
        // Convert everything to (cloned) vectors
        const p: Vector3 = new Vector3(this.origin.x, this.origin.y, this.origin.z); // P1
        const v: Vector3 = this.direction.clone(); // v
        const q: Vector3 = new Vector3(r2.origin.x, r2.origin.y, r2.origin.z); // Q1
        const u: Vector3 = r2.direction.clone(); // u

        // find a = v x u
        const a: Vector3 = v.clone().cross(u); // cross product

        // find dot product = (v x u) . (v x u)
        const dot = a.dot(a); // inner product

        // if v and u are parallel (v x u = 0), then no intersection, return null
        if (dot === 0) {
            return null;
        }

        // find b = (Q1-P1) x u
        const b: Vector3 = Vector3.Subtract(q, p).cross(u); // cross product

        // find t = (b.a)/(a.a) = ((Q1-P1) x u) .(v x u) / (v x u) . (v x u)
        const t: number = b.dot(a) / dot;

        // find intersection point by substituting t to the line1 eq
        // Vector3 point = p + (t * v);
        const intersection: Vector3 = p.clone().add(v.multiplyScalar(t));

        const point = new XYZ(intersection.x, intersection.y, intersection.z);
        return point;
    }

    toString() {
        return `p:${this.origin.x},${this.origin.y},${this.origin.z}|v:${this.direction.x},${this.direction.y},${this.direction.z}`
    };
}
