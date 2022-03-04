import CircleMovingObject from "./CircleMovingObject";
import {createCircle} from "./Utils";
import * as PIXI from "pixi.js"
import GameManager from "./GameManager";


export default class Planet extends CircleMovingObject {
    textStyle: PIXI.TextStyle;
    infoText: PIXI.Text;

    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number, R: number) {
        super(gm, x, y, vx, vy, mass, R);

        this.textStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 16,
            fill: "white",
        })
        this.infoText = new PIXI.Text("", this.textStyle);
        this.app.stage.addChild(this.infoText);

        this.gm.objects.Planets.push(this);
    }

    createSprite() {
        this.sprite = createCircle({
            R: this.R,
            lineWidth: 3,
            alignment: 0,
            fillColor: 0x999999,
        });
    }

    setPos(x: number, y: number) {
        super.setPos(x, y);
        // this.infoText.position.set(x + this.R, y - this.R);
        this.infoText.scale.set(this.gm.camera.scale, this.gm.camera.scale)

        this.infoText.x = (x + this.R) * this.gm.camera.scale - this.gm.camera.pos.x;
        this.infoText.y = (y - this.R) * this.gm.camera.scale - this.gm.camera.pos.y;
    }

    move() {
        this.calculateGravityWithOtherBodies(this.gm.objects.Planets);
        this.updateInfo();
        if (this.gm.options.PLANET_PLANET_COLLISION) {
            this.checkAndDoCollision(this.gm.objects.Planets);
        }
        super.move();
    }

    updateInfo() {
        let vel = `Velocity: ${this.velocity.magnitude().toFixed(10)}\n`;
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