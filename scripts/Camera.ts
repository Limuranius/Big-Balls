import GameManager from "./GameManager";
import * as PIXI from "pixi.js"
import MovingObject from "./MovingObject";


export default class Camera {
    gm: GameManager
    pos: PIXI.Point;
    scale: number;
    scaleIncreaseFactor: number;
    target: MovingObject | null

    constructor(gm: GameManager) {
        this.gm = gm
        this.pos = new PIXI.Point(0, 0)
        this.scale = 1  // пикс/коорд. Сколько пикселей занимает одна координатная единица
        this.scaleIncreaseFactor = 1.1
        this.target = null

        gm.app.ticker.add(this.updateLoop.bind(this))
    }

    updateLoop() {
        this.focusOnTarget()
    }

    setFocus(obj: MovingObject): void {
        this.target = obj
    }

    focusOnTarget(): void {
        if (this.target != null) {
            let width = this.gm.app.view.width
            let height = this.gm.app.view.height
            let targetPos = new PIXI.Point(this.target.body.position.x, this.target.body.position.y)
            this.pos = this.coordsToPixels(targetPos).subtract(new PIXI.Point(width / 2, height / 2))

        }
    }

    coordsToPixels(point: PIXI.Point) {
        return point.multiplyScalar(this.scale)
    }
}