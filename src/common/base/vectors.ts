// Taken largely from three.js/src/math/Vector3.js

import { IPoint3D } from "./points";

export class Vector3 {
	static Subtract(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
	}
	static PointDiff(to: IPoint3D, from: IPoint3D) {
		return new Vector3(to.x - from.x, to.y - from.y, to.z - from.z);
	}

	x: number;
	y: number;
	z: number;
	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	clone() {
		return new Vector3(this.x, this.y, this.z);
	}
	equals(v: Vector3) {
		//return this.x === v.x && this.y === v.y && this.z === v.z;
		const tol =0.01; //Number.EPSILON;
		return Math.abs(this.x - v.x) < tol &&
			Math.abs(this.y - v.y) < tol &&
			Math.abs(this.z - v.z) < tol;
	}
	// Mutates the vector
	add(v: Vector3) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}
	dot(v: Vector3) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	// Mutates the vector
	cross(v: Vector3) {
		return this.crossVectors(this, v);
	}
	crossVectors(a: Vector3, b: Vector3) {
		const ax = a.x, ay = a.y, az = a.z;
		const bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;
	}
	// Mutates the vector
	multiplyScalar(scalar: number) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	// Mutates the vector
	normalize() {
		return this.multiplyScalar(1 / this.length() || 1);
	}
}
