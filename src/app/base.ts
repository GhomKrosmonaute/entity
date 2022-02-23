import { Entity } from "@ghom/entity"
import { Ticker, Renderer } from "pixi.js"

export class Base extends Entity {
  static frameTime = 0
  static lastFrameTime = 0
  static timeSinceLastFrame = 0
  static timeSinceStart = 0
  static ticker = Ticker.shared
}
