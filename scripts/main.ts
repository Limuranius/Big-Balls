import {
    GameManager,
    Ball, Planet, Button, Rocket,
    randomFloatBetween, randInt,
    EARTH_MASS, EARTH_RADIUS, MOON_MASS, MOON_RADIUS,
} from "./index";


function main(): void {
    const gm = new GameManager()

    new Button(gm.app, 100, 200, "Planets", () => {
        gm.clearStage();
        new Planet(gm, 100, 100, 0, 0, 100, 100);
        new Planet(gm, 800, 800, 0, 0, 100, 100);
    });
    new Button(gm.app, 100, 300, "Asteroids", () => {
        gm.clearStage();
        new Planet(gm, 500, 500, 0, 0, 500, 100);
        setInterval(func, 1)

        function func() {
            new Rocket(gm, 500, 300, randomFloatBetween(-3, 3), randomFloatBetween(0, 3));
        }
    });
    new Button(gm.app, 100, 400, "Collision", () => {
        gm.clearStage();
        new Ball(gm, 200, 350, 2, 0, 100, 50);
        new Ball(gm, 600, 400, 0, 0, 100, 50);
    });
    new Button(gm.app, 100, 500, "Billiard", () => {
        gm.clearStage();
        new Ball(gm, 200, 400, 2, 0, 500, 50);

        new Ball(gm, 1000, 400, 0, 0, 100, 50);

        new Ball(gm, 1100, 340, 0, 0, 100, 50);
        new Ball(gm, 1100, 460, 0, 0, 100, 50);

        new Ball(gm, 1200, 280, 0, 0, 100, 50);
        new Ball(gm, 1200, 400, 0, 0, 100, 50);
        new Ball(gm, 1200, 520, 0, 0, 100, 50);
    });
    new Button(gm.app, 100, 600, "Random", () => {
        gm.clearStage();
        new Planet(gm, 900, 500, 0, 0, 1000, 100);
        setInterval(func, 1)

        function func() {
            new Rocket(gm, randInt(100, 1800), randInt(100, 900), randomFloatBetween(-3, 3), randomFloatBetween(-3, 3));
        }
    });
    new Button(gm.app, 100, 700, "Earth-Moon", () => {
        gm.clearStage();

        let scale = 1 / 1000000
        let Earth = new Planet(gm, 700, 300, 0, 0, EARTH_MASS * scale ** 3, EARTH_RADIUS * scale)
        let Moon = new Planet(gm, 100, 300, 0, 257, 1, MOON_RADIUS * scale)
        // console.log(Earth.mass, Earth.R)
    });

    let b1 = new Button(gm.app, 400, 200, "Включить коллизию планет", () => {
        gm.options.PLANET_PLANET_COLLISION = true;
        gm.app.stage.removeChild(b1.button);
    }, 530);
    let b2 = new Button(gm.app, 400, 300, "Включить коллизию планет с астероидами", () => {
        gm.options.ROCKET_PLANET_COLLISION = true;
        gm.app.stage.removeChild(b2.button);
    }, 530);
    let b3 = new Button(gm.app, 400, 400, "Включить коллизию астероидов", () => {
        gm.options.ROCKET_ROCKET_COLLISION = true;
        gm.app.stage.removeChild(b3.button);
    }, 530);
}

main()