import { map } from "./util"
import { Entity } from "./entity"
import { EasingFunction, easingSet } from "./easing"

export interface AnimationSettings {
  from: number
  to: number
  /**
   * Animation duration **in frame count**!
   */
  duration: number
  easing?: EasingFunction
  onSetup?: () => unknown
  onUpdate?: (value: number) => unknown
  afterUpdate?: (value: number) => unknown
  onTeardown?: () => unknown
}

/**
 * Equivalent of Tween
 */
export class Animation extends Entity {
  private readonly easing: EasingFunction

  constructor(private settings: AnimationSettings) {
    super()
    this.easing = settings.easing ?? easingSet.linear
  }

  onSetup() {
    this.settings.onSetup?.()
  }

  onUpdate() {
    if (this.isFinish) {
      this.teardown()
      return false
    } else {
      this.settings.onUpdate?.(this.value)
    }
  }

  afterUpdate() {
    if (this.isFinish) {
      this.teardown()
      return false
    } else {
      this.settings.afterUpdate?.(this.value)
    }
  }

  onTeardown() {
    this.settings.onTeardown?.()
  }

  get isFinish() {
    return Entity.frameCount - this._startFrame >= this.settings.duration
  }

  get value() {
    return map(
      this.easing(
        (Entity.frameCount - this._startFrame) / this.settings.duration
      ),
      0,
      1,
      this.settings.from,
      this.settings.to
    )
  }
}
