import { EasingFunction, easingSet } from "./easing"
import { Time } from "./time"

export interface AnimationSettings {
  from: number
  to: number
  /**
   * Animation duration in **frame count**!
   */
  duration: number
  easing?: EasingFunction
  onSetup?: () => unknown
  onDraw?: (value: number) => unknown
  onUpdate?: (value: number) => unknown
  onTeardown?: () => unknown
}

/**
 * Equivalent of Tween
 */
export class Animation extends Time {
  private easing: EasingFunction

  constructor(private settings: AnimationSettings) {
    super()
    this.easing = settings.easing ?? easingSet.linear
  }

  onSetup() {
    this.settings.onSetup?.()
    super.onSetup()
    this.settings.onUpdate?.(this.settings.from)
  }

  onDraw() {
    this.settings.onDraw?.(
      map(
        this.settings.easing(
          (frameCount - this.startedAt) / this.settings.duration
        ),
        0,
        1,
        this.settings.from,
        this.settings.to
      )
    )
  }

  onUpdate() {
    if (frameCount - this.startedAt >= this.settings.duration) {
      this.teardown()
    } else {
      this.settings.onUpdate?.(
        map(
          this.settings.easing(
            (frameCount - this.startedAt) / this.settings.duration
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
    this.settings.onUpdate?.(this.settings.to)
    this.settings.onTeardown?.()
  }
}
