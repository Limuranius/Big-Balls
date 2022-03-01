import MovingObject from "./MovingObject";
import Vector from "./Vector";
import GameManager from "./GameManager";

export default abstract class CircleMovingObject extends MovingObject {
    R: number;

    protected constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number, R: number) {
        super(gm, x, y, vx, vy, mass);
        this.R = R;
        this.createSprite();
        this.app.stage.addChild(this.sprite);
    }

    abstract createSprite(): void;

    getOneCollidingBody(listOfBodies: Array<CircleMovingObject>): CircleMovingObject | null {
        for (let body of listOfBodies) {
            if (body != this) {
                let dx = body.x - this.x;
                let dy = body.y - this.y;
                let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                if (dist <= this.R + body.R) {
                    return body;
                }
            }
        }
        return null;
    }

    checkAndDoCollision(listOfBodies: Array<CircleMovingObject>): void {
        let body = this.getOneCollidingBody(listOfBodies);
        if (body != null) {
            this.remove()
            let dx = body.x - this.x;
            let dy = body.y - this.y;
            let normalVector = new Vector(dx, dy);
            let unitNormal = normalVector.dividedBy(normalVector.getMagnitude());
            let unitTangent = new Vector(-unitNormal.y, unitNormal.x);
            let v1 = new Vector(this.vx, this.vy);
            let v2 = new Vector(body.vx, body.vy);

            let v1normalScalar = Vector.dotProduct(unitNormal, v1);
            let v1tangentScalar = Vector.dotProduct(unitTangent, v1);
            let v2normalScalar = Vector.dotProduct(unitNormal, v2);
            let v2tangentScalar = Vector.dotProduct(unitTangent, v2);

            let v1tangentScalarNew = v1tangentScalar;
            let v2tangentScalarNew = v2tangentScalar;
            let v1normalScalarNew = (v1normalScalar * (this.mass - body.mass) + 2 * body.mass * v2normalScalar) / (this.mass + body.mass);
            let v2normalScalarNew = (v2normalScalar * (body.mass - this.mass) + 2 * this.mass * v1normalScalar) / (this.mass + body.mass);

            let v1normalVector = unitNormal.multipliedBy(v1normalScalarNew);
            let v2normalVector = unitNormal.multipliedBy(v2normalScalarNew);
            let v1tangentVector = unitTangent.multipliedBy(v1tangentScalarNew);
            let v2tangentVector = unitTangent.multipliedBy(v2tangentScalarNew);

            let v1New = Vector.addition(v1normalVector, v1tangentVector);
            let v2New = Vector.addition(v2normalVector, v2tangentVector);

            this.vx = v1New.x;
            this.vy = v1New.y;
            body.vx = v2New.x;
            body.vy = v2New.y;

            this.moveWithoutChecking();
            body.moveWithoutChecking();
        }
    }
}