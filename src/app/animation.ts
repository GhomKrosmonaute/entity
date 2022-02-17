import { map } from "./util"
import { Entity } from "./entity"
import { EasingFunction, easingSet } from "./easing"

export interface AnimationSettings {
  from: number
  to: number
  /**
   * Animation duration in **frame count**!
   */
  duration: number
  easing?: EasingFunction
  onSetup?: () => unknown
  onUpdate?: (value: number) => unknown
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
    if (Entity.frameCount - this._startFrame >= this.settings.duration) {
      this.teardown()
      return false
    } else {
      this.settings.onUpdate?.(
        map(
          this.easing(
            (Entity.frameCount - this._startFrame) / this.settings.duration
          ),
          0,
          1,
          this.settings.from,
          this.settings.to
        )
      )
    }
  }

  onTeardown() {
    this.settings.onTeardown?.()
  }
}
