import MovingObject from "./MovingObject";
import GameManager from "./GameManager";
import "@pixi/math-extras"
import * as PIXI from "pixi.js"

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
                // ---------------------------
                let dPos = body.pos.subtract(this.pos)
                let distSquared = dPos.magnitudeSquared();
                if (distSquared <= (this.R + body.R) ** 2) {
                    return body;
                }
            }
        }
        return null;
    }

    checkAndDoCollision(listOfBodies: Array<CircleMovingObject>): void {
        let body = this.getOneCollidingBody(listOfBodies);
        if (body != null) {
            // this.remove()
            let dPos = body.pos.subtract(this.pos)
            let unitNormal = dPos.normalize();
            let unitTangent = new PIXI.Point(-unitNormal.y, unitNormal.x);
            let v1 = this.velocity;
            let v2 = body.velocity;

            let v1normalScalar = v1.dot(unitNormal)
            let v1tangentScalar = v1.dot(unitTangent)
            let v2normalScalar = v2.dot(unitNormal)
            let v2tangentScalar = v2.dot(unitTangent)

            let v1tangentScalarNew = v1tangentScalar;
            let v2tangentScalarNew = v2tangentScalar;
            let v1normalScalarNew = (v1normalScalar * (this.mass - body.mass) + 2 * body.mass * v2normalScalar) / (this.mass + body.mass);
            let v2normalScalarNew = (v2normalScalar * (body.mass - this.mass) + 2 * this.mass * v1normalScalar) / (this.mass + body.mass);

            let v1normalVector = unitNormal.multiplyScalar(v1normalScalarNew);
            let v2normalVector = unitNormal.multiplyScalar(v2normalScalarNew);
            let v1tangentVector = unitTangent.multiplyScalar(v1tangentScalarNew);
            let v2tangentVector = unitTangent.multiplyScalar(v2tangentScalarNew);

            let v1New = v1normalVector.add(v1tangentVector);
            let v2New = v2normalVector.add(v2tangentVector);

            this.velocity = v1New
            body.velocity = v2New

            this.moveWithoutChecking();
            body.moveWithoutChecking();
        }
    }
}