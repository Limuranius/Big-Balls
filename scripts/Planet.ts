import CircleMovingObject from "./CircleMovingObject";
import {createCircle} from "./Utils";
import * as PIXI from "pixi.js"
import GameManager from "./GameManager";
import Matter, {Body} from "matter-js";


export default class Planet extends CircleMovingObject {
    infoText: PIXI.Text;

    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number, R: number) {
        super(gm, x, y, vx, vy, mass, R);
        this.infoText = new PIXI.Text("", {
            fontFamily: "Arial",
            fontSize: 16,
            fill: "white",
        });
        this.gm.app.stage.addChild(this.infoText);

        this.gm.objects.Planets.push(this);

        Matter.Body.setStatic(this.body, true)
    }

    gameLoop() {
        super.gameLoop();
        this.calculateGravityWithOtherBodies(this.gm.objects.Planets)
        this.updateInfo()
    }

    createSprite(): PIXI.Sprite | PIXI.Graphics {
        return createCircle({
            R: this.R,
            lineWidth: 3,
            alignment: 0,
            fillColor: 0x999999,
        });
    }

    renderSprite() {
        super.renderSprite();
        this.infoText.scale.set(this.gm.camera.scale, this.gm.camera.scale)
        this.infoText.x = (this.body.position.x + this.R) * this.gm.camera.scale - this.gm.camera.pos.x;
        this.infoText.y = (this.body.position.y - this.R) * this.gm.camera.scale - this.gm.camera.pos.y;
    }

    updateInfo() {
        let vel = `Velocity: ${Matter.Vector.magnitude(this.body.velocity).toFixed(10)}\n`;
        let mass = `Mass: ${this.mass.toFixed(0)}\n`
        let radius = `Radius: ${this.R.toFixed(2)}`
        this.infoText.text = vel + mass + radius
    }

    remove() {
        super.remove();
        let index = this.gm.objects.Planets.indexOf(this);
        this.gm.objects.Planets.splice(index, 1)
    }
}