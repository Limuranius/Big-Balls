import * as PIXI from "pixi.js"

export function randomFloatBetween(a: number, b: number): number {
    let diff = b - a;
    return a + Math.random() * diff;
}


export function randInt(a: number, b: number): number {
    // [a : b)
    let diff = b - a;
    return a + Math.floor(Math.random() * diff)
}


export function getRandomColor(): number {
    let letters = '0123456789ABCDEF';
    let color = '0x';
    for (let i = 0; i < 6; i++) {
        color += letters[randInt(0, 16)];
    }
    return Number(color);
}


export function radiansToDegrees(radians: number): number {
    return radians / Math.PI * 180;
}


export function findDistance(dx: number, dy: number): number {
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

interface IGeometry {
    x?: number,
    y?: number,
    lineWidth?: number,
    lineColor?: number,
    lineAlpha?: number,
    fillColor?: number,
    alignment?: number,
}

interface ICircle extends IGeometry {
    R?: number,
}

export function createCircle(
    {
        x = 0,
        y = 0,
        R = 20,
        lineWidth = 1,
        lineColor = 0xffffff,
        lineAlpha = 1,
        fillColor = 0x000000,
        alignment = 0.5,
    }: ICircle) {

    let circle = new PIXI.Graphics();
    circle.lineStyle(lineWidth, lineColor, lineAlpha, alignment);
    circle.beginFill(fillColor);
    circle.drawCircle(x, y, R);
    circle.endFill();
    return circle;
}

interface IRectangle extends IGeometry {
    width?: number,
    height?: number,
    anchorX?: number,
    anchorY?: number,
}

export function createRectangle(
    {
        x = 0,
        y = 0,
        width = 100,
        height = 20,
        lineWidth = 1,
        lineColor = 0xffffff,
        lineAlpha = 1,
        fillColor = 0x000000,
        alignment = 0.5,
        anchorX = 0,
        anchorY = 0,
    }: IRectangle) {

    // Смещаем координаты, чтобы anchor был в точке (0, 0)
    x = -width * anchorX
    y = -height * anchorY

    let rect = new PIXI.Graphics();
    rect.lineStyle(lineWidth, lineColor, lineAlpha, alignment);
    rect.beginFill(fillColor);
    rect.drawRect(x, y, width, height);
    rect.endFill();
    return rect;
}

interface ITriangle extends IGeometry {
    size?: number,
}

export function createTriangle(
    {
        x = 0,
        y = 0,
        size = 50,
        lineWidth = 1,
        lineColor = 0xffffff,
        lineAlpha = 1,
        fillColor = 0x000000,
        alignment = 0.5,
    }: ITriangle) {

    let points = [
        0, size / 2,
        size, size,
        size, 0
    ]
    let triangle = new PIXI.Graphics();
    triangle.lineStyle(lineWidth, lineColor, lineAlpha, alignment);
    triangle.beginFill(fillColor);
    triangle.drawPolygon(points);
    triangle.endFill();
    triangle.pivot.set(size / 2, size / 2);
    return triangle;
}