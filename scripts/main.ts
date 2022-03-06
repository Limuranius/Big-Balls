import {
    GameManager,
    Ball, Planet, Button, Rocket,
    randomFloatBetween, randInt,
    EARTH_MASS, EARTH_RADIUS, MOON_MASS, MOON_RADIUS, EARTH_MOON_DIST,
} from "./index";
// import Player from "./Player";


function createFlagButtons(gm: GameManager) {
    function option1() {
        gm.clearStage();
        new Planet(gm, 100, 100, 5, 0, 5e13, 100);
        new Planet(gm, 800, 800, 0, 0, 5e13, 100);
    }

    function option2() {
        gm.clearStage();

        new Ball(gm, 0, 0, 0, 0, 0, 20)

        // gm.camera.setFocus(new Player(gm, 100, 100, 0, 0))

        let planet = new Planet(gm, 500, 500, 0, 0, 5e13, 50);
        let height = 300

        for (let i = 0; i < 1000; i++) {
            setTimeout(() => {
                let vx = randomFloatBetween(-10, 10) * 0.6
                new Rocket(gm, planet.body.position.x, planet.body.position.y + height, vx, 0)
                // new Rocket(gm, planet.pos.x, planet.pos.y - height, vx, 0)
            }, i * 5)
        }

        // for (let i = 0; i < 50000; i++) {
        //     setTimeout(() => {
        //         let vx = randomFloatBetween(1, 10) * 0.6
        //         new Rocket(gm, 500, 700, vx, 0)
        //     }, i * 5)
        // }
    }

    function option3() {
        gm.clearStage();
        new Ball(gm, 200, 350, 2, 0, 100, 50);
        new Ball(gm, 600, 400, 0, 0, 100, 50);
    }

    function option4() {
        gm.clearStage();
        new Ball(gm, 200, 400, 2, 0, 500, 50);

        new Ball(gm, 1000, 400, 0, 0, 100, 50);

        new Ball(gm, 1100, 340, 0, 0, 100, 50);
        new Ball(gm, 1100, 460, 0, 0, 100, 50);

        new Ball(gm, 1200, 280, 0, 0, 100, 50);
        new Ball(gm, 1200, 400, 0, 0, 100, 50);
        new Ball(gm, 1200, 520, 0, 0, 100, 50);
    }

    function option5() {
        gm.clearStage();
        new Planet(gm, 900, 500, 0, 0, 1000, 100);
        setInterval(func, 1)

        function func() {
            new Rocket(gm, randInt(100, 1800), randInt(100, 900), randomFloatBetween(-3, 3), randomFloatBetween(-3, 3));
        }
    }

    function option6() {
        gm.clearStage();

        let scale = 1 / 10000
        // Earth
        new Planet(gm, 0, 0, 0, 0, EARTH_MASS * scale ** 3, EARTH_RADIUS * scale)

        // Moon
        new Planet(gm, 0 - EARTH_MOON_DIST * scale, 0, 0, 0, MOON_MASS * scale ** 3, MOON_RADIUS * scale)
    }

    new Button(gm.app, 100, 200, "Planets", option1);
    new Button(gm.app, 100, 300, "Asteroids", option2);
    new Button(gm.app, 100, 400, "Collision", option3);
    new Button(gm.app, 100, 500, "Billiard", option4);
    new Button(gm.app, 100, 600, "Random", option5);
    new Button(gm.app, 100, 700, "Earth-Moon", option6);
}

function createOptionButtons(gm: GameManager) {
    let b1 = new Button(gm.app, 400, 200, "Включить коллизию планет", () => {
        gm.options.PLANET_PLANET_COLLISION = true;
        gm.app.stage.removeChild(b1.button);
    }, 530);
    let b2 = new Button(gm.app, 400, 300, "Включить коллизию планет с астероидами", () => {
        gm.options.ASTEROID_PLANET_COLLISION = true;
        gm.app.stage.removeChild(b2.button);
    }, 530);
    let b3 = new Button(gm.app, 400, 400, "Включить коллизию астероидов", () => {
        gm.options.ASTEROID_ASTEROID_COLLISION = true;
        gm.app.stage.removeChild(b3.button);
    }, 530);
}

function createMenu(gm: GameManager) {
    createOptionButtons(gm)
    createFlagButtons(gm);
}


function main(): void {
    const gm = new GameManager()

    createMenu(gm)
}

main()