import * as PIXI from "pixi.js"

export default class GameManager {
    readonly app: PIXI.Application;
    readonly interactionManager: PIXI.InteractionManager;
    keysPressed: {[key: string]: boolean}
    mouseButtonsPressed: {[key: string]: boolean}

    options: {
        PLANET_PLANET_COLLISION: boolean,
        ROCKET_PLANET_COLLISION: boolean,
        ROCKET_ROCKET_COLLISION: boolean,
    }

    constructor() {
        this.options = {
            PLANET_PLANET_COLLISION: false,  // true - планеты будут отталкиваться друг от друга
            ROCKET_PLANET_COLLISION: false,  // true - ракеты будут отталкиваться от планет
            ROCKET_ROCKET_COLLISION: false,  //	true - ракеты будут отталкиваться друг от друга
        }

        this.app = new PIXI.Application({
            resizeTo: window,
        })
        document.body.appendChild(this.app.view);
        this.app.stage.interactive = true;
        this.interactionManager = new PIXI.InteractionManager(this.app.renderer)

        // Присваиваем клавишам клавиатуры и мыши свои действия
        this.keysPressed = {};
        this.mouseButtonsPressed = {};
        window.addEventListener("keydown", (ev) => {
            this.keysPressed[ev.code] = true;
        });
        window.addEventListener("keyup", (ev) => {
            this.keysPressed[ev.code] = false;
        });
        window.addEventListener("mousedown", (ev) => {
            this.mouseButtonsPressed[ev.button] = true;
        });
        window.addEventListener("mouseup", (ev) => {
            this.mouseButtonsPressed[ev.button] = false;
        });
    }

    getMousePos(): PIXI.Point {
        return this.interactionManager.mouse.global;
    }

    clearStage(): void {
        for (let i = this.app.stage.children.length; i >= 0; i--) {
            this.app.stage.removeChild(this.app.stage.children[i]);
        }
    }
}