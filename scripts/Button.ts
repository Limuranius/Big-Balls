import * as PIXI from "pixi.js"
import {createRectangle} from "./Utils";

export default class Button {
    readonly app: PIXI.Application;
    x: number;
    y: number;
    text: PIXI.Text;
    textureMouseOver: PIXI.Graphics;
    defaultTexture: PIXI.Graphics;
    texture: PIXI.Graphics;
    button: PIXI.Container;


    constructor(app: PIXI.Application, x: number, y: number, text: string, event: () => void, width: number = 150) {
        this.app = app
        this.x = x;
        this.y = y;
        this.text = new PIXI.Text(text);
        this.textureMouseOver = createRectangle({
            fillColor: 0xff0000,
            width: width,
            height: 100,
        });
        this.defaultTexture = createRectangle({
            fillColor: 0xccccff,
            width: width,
            height: 50,
        });
        this.texture = this.defaultTexture;

        this.button = new PIXI.Container();
        this.button.addChild(this.texture);
        this.button.addChild(this.text);
        //this.text.anchor.set(0.5, 0.5);
        this.text.position.set(this.button.width / 2 - this.text.width / 2, this.button.height / 2 - this.text.height / 2);

        this.button.interactive = true;
        this.button.buttonMode = true;

        this.button
            .on('pointerdown', event)
            .on('pointerover', this.onButtonOver)
            .on('pointerout', this.onButtonOut);

        app.stage.addChild(this.button);
        this.button.position.set(this.x, this.y);
    }

    onButtonOver(): void {
        this.texture = this.textureMouseOver;
    }

    onButtonOut(): void {
        this.texture = this.defaultTexture;
    }
}