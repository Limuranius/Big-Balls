import GameManager from "./GameManager";
import * as PIXI from "pixi.js";

type position = "top-left" | "top-right" | "bottom-left" |  "bottom-right"

export default class FPSCounter {
    gm: GameManager;
    position: position;
    text: PIXI.Text

    constructor(gm: GameManager, position: position) {
        this.gm = gm;
        this.position = position;

        this.text = new PIXI.Text("", new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 16,
            fill: "white",
        }));
        this.gm.app.stage.addChild(this.text);

        switch (position) {
            case "top-left":
                this.text.x = 0;
                this.text.y = 0;
                break;
            case "top-right":
                this.text.x = this.gm.app.view.width - this.text.width;
                this.text.y = 0;
                break;
            case "bottom-left":
                this.text.x = 0;
                this.text.y = this.gm.app.view.height - this.text.height;
                break;
            case "bottom-right":
                this.text.x = this.gm.app.view.width - this.text.width;
                this.text.y = this.gm.app.view.height - this.text.height;
                break;
        }

        this.gm.app.ticker.add(this.update.bind(this))
    }

    update() {
        let fps = `FPS: ${this.gm.app.ticker.FPS.toFixed(0)}\n`;
        let asteroids_count = `Asteroids: ${this.gm.objects.Asteroids.length}\n`
        let planets_count = `Planets: ${this.gm.objects.Planets.length}\n`
        this.text.text = fps + asteroids_count + planets_count
    }
}