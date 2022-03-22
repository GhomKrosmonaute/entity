import * as p5 from "p5"
import { Base } from "./base"

export abstract class Shape extends Base {
  style?: () => unknown
  scaleX = 1
  scaleY = 1
  anchorX = 0
  anchorY = 0
  abstract _x: number
  abstract _y: number
  abstract _width: number
  abstract _height: number
  abstract get centerX(): number
  abstract get centerY(): number
  abstract readonly isHovered: boolean

  get x() {
    return this._x + this.anchorX
  }

  get y() {
    return this._y + this.anchorY
  }

  get width() {
    return this._width * this.scaleX
  }

  get height() {
    return this._height * this.scaleY
  }

  get center() {
    return createVector(this.centerX, this.centerY)
  }

  get position() {
    return createVector(this.x, this.y)
  }

  get size() {
    return createVector(this.width, this.height)
  }

  get centerDuple(): [x: number, y: number] {
    return [this.centerX, this.centerY]
  }

  get positionDuple(): [x: number, y: number] {
    return [this.x, this.y]
  }

  get sizeDuple(): [w: number, h: number] {
    return [this.width, this.height]
  }

  setStyle(style: () => unknown) {
    this.style = style
    return this
  }

  onUpdate() {
    this.style?.()
  }
}

export class Rect extends Shape {
  constructor(
    public _x: number,
    public _y: number,
    public _width: number,
    public _height: number,
    public tl?: number,
    public tr?: number,
    public br?: number,
    public bl?: number
  ) {
    super()
  }

  get centerX() {
    return this.x + this.width / 2
  }

  get centerY() {
    return this.y + this.height / 2
  }

  get isHovered(): boolean {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    )
  }

  onUpdate() {
    super.onUpdate()
    rect(
      this.x,
      this.y,
      this.width,
      this.height,
      this.tl ? this.tl * ((this.scaleX + this.scaleY) / 2) : undefined,
      this.tr ? this.tr * ((this.scaleX + this.scaleY) / 2) : undefined,
      this.br ? this.br * ((this.scaleX + this.scaleY) / 2) : undefined,
      this.bl ? this.bl * ((this.scaleX + this.scaleY) / 2) : undefined
    )
  }
}

export class Circle extends Shape {
  constructor(public _x: number, public _y: number, public diameter: number) {
    super()
  }

  get _width() {
    return this.diameter
  }

  get _height() {
    return this.diameter
  }

  get centerX() {
    return this.x
  }

  get centerY() {
    return this.y
  }

  get isHovered(): boolean {
    return dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2
  }

  onUpdate() {
    super.onUpdate()
    circle(this.x, this.y, this.width)
  }
}

export class Ellipse extends Shape {
  constructor(
    public _x: number,
    public _y: number,
    public _width: number,
    public __height?: number
  ) {
    super()
  }

  get _height(): number {
    return this.__height ?? this._width
  }

  get centerX() {
    return this.x
  }

  get centerY() {
    return this.y
  }

  get isHovered(): boolean {
    return (
      Math.pow(mouseX - this.x, 2) / Math.pow(this.width / 2, 2) +
        Math.pow(mouseY - this.y, 2) / Math.pow(this.height / 2, 2) <=
      1
    )
  }

  onUpdate() {
    super.onUpdate()
    ellipse(this.x, this.y, this.width, this.height)
  }
}

export class Line extends Shape {
  constructor(public _x = 0, public _y = 0, public x2 = 0, public y2 = 0) {
    super()
  }

  get _width() {
    return this.x2 - this._x
  }

  get _height() {
    return this.y2 - this._y
  }

  get length() {
    return dist(this.x, this.y, this.x + this.width, this.y + this.height)
  }

  get centerX() {
    return this.x + this.width / 2
  }

  get centerY() {
    return this.y + this.height / 2
  }

  get isHovered(): boolean {
    return (
      dist(this.x, this.y, mouseX, mouseY) +
        dist(mouseX, mouseY, this.x + this.width, this.y + this.height) <=
      this.length
    )
  }

  onUpdate() {
    super.onUpdate()
    line(this.x, this.y, this.x + this.width, this.y + this.height)
  }
}

export class Image extends Rect {
  constructor(
    public img: p5.Image,
    x = 0,
    y = 0,
    width?: number,
    height?: number
  ) {
    super(x, y, width ?? img.width, height ?? img.height)
  }

  onUpdate() {
    super.onUpdate()
    image(this.img, this.x, this.y, this.width, this.height)
  }
}

export class Text extends Shape {
  dynamicWidth = 0
  dynamicHeight = 0

  constructor(
    public text = "",
    public _x = 0,
    public _y = 0,
    public __width?: number,
    public __height?: number
  ) {
    super()
  }

  get _width(): number {
    return this.__width ?? this.dynamicWidth
  }

  get _height(): number {
    return this.__height ?? this.dynamicHeight
  }

  get centerX() {
    return this.x + this.width / 2
  }

  get centerY() {
    return this.y + this.height / 2
  }

  get isHovered(): boolean {
    return (
      mouseX > this.centerX - this.width / 2 &&
      mouseX < this.centerX + this.width / 2 &&
      mouseY > this.centerY - this.height / 2 &&
      mouseY < this.centerX + this.height / 2
    )
  }

  onUpdate() {
    super.onUpdate()
    const font = textFont() as p5.Font
    const bounds = font.textBounds(this.text, this.x, this.y, textSize()) as {
      x: number
      y: number
      w: number
      h: number
    }
    this.dynamicWidth = bounds.w
    this.dynamicHeight = bounds.h
    text(this.text, this.x, this.y, this.width, this.height)
  }
}
