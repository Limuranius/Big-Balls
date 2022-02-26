export default class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getMagnitude(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    multipliedBy(n: number): Vector {
        return new Vector(this.x * n, this.y * n);
    }

    dividedBy(n: number): Vector {
        return new Vector(this.x / n, this.y / n);
    }

    static dotProduct(vect1: Vector, vect2: Vector): number {
        return vect1.x * vect2.x + vect1.y * vect2.y;
    }

    static addition(vect1: Vector, vect2: Vector): Vector {
        return new Vector(vect1.x + vect2.x, vect1.y + vect2.y);
    }
}