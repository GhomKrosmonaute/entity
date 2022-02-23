import { AnimatedSprite, Sprite } from "pixi.js"
import { ContainerEntity } from "./container"
import { Base } from "./base"

export class SpriteEntity extends ContainerEntity {
  constructor(sprite: Sprite) {
    super(sprite)
  }
}

// prettier-ignore
export type AnimatedSpriteEntityOptions = {
  autoUpdate?: boolean
  autoPlay?: boolean
  resetOnStart?: boolean
} & (
  | { loop?: boolean }
  | { mirrorLoop?: boolean }
) & (
  | { keepAlive?: boolean }
  | { resetOnFinish?: boolean }
)

export class AnimatedSpriteEntity extends ContainerEntity {
  constructor(
    public readonly sprite: AnimatedSprite,
    public options?: AnimatedSpriteEntityOptions
  ) {
    super(sprite)
    this.sprite.autoUpdate = options?.autoUpdate ?? false
  }

  onSetup() {
    if (this.options) {
      if (this.options.autoPlay && this.options.resetOnStart) {
        this.sprite.gotoAndStop(0)
      }
      if (this.options.autoPlay) {
        this.sprite.play()
      }
    }

    super.onSetup()
  }

  onUpdate(): boolean | void {
    if (this.options) {
      if (this.options.autoUpdate) {
        this.sprite.update(Base.timeSinceLastFrame)
      }
    }
  }

  onTeardown() {
    super.onTeardown()
  }

  play() {
    this.sprite.play()
  }

  stop() {
    this.sprite.gotoAndStop(0)
  }

  pause() {
    this.sprite.stop()
  }
}
