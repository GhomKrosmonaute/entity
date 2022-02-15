import { Base } from "@ghom/entity-base"

export type EntityEventName =
  | "setup"
  | "update"
  | "teardown"
  | "draw"
  | "mousePressed"
  | "mouseReleased"
  | "keyPressed"
  | "keyReleased"

export type EntityResolvable = Entity | (() => Entity)

export class Entity extends Base<EntityEventName> {
  static resolve(entity: EntityResolvable) {
    return typeof entity === "function" ? entity() : entity
  }

  protected _children = new Set<Entity>()
  protected _zIndex?: number

  get zIndex(): number {
    return this._zIndex ?? this.parent?.children.indexOf(this) ?? 0
  }

  get children(): Array<Entity> {
    return [...this._children]
  }

  /**
   * Used to be overwritten by your own workings
   */
  onDraw() {}

  /**
   * Used to be overwritten by your own workings
   */
  onMouseReleased() {}

  /**
   * Used to be overwritten by your own workings
   */
  onMousePressed() {}

  /**
   * Used to be overwritten by your own workings
   */
  onKeyReleased() {}

  /**
   * Used to be overwritten by your own workings
   */
  onKeyPressed() {}

  /**
   * Should only be called if the current entity is a root.
   * Should not be overwritten!
   */
  public draw() {
    if (this.isSetup) {
      this.onDraw()
      this.transmit("draw")
    } else {
      console.warn("Draw is called before setup")
    }
  }

  /**
   * Should only be called if the current entity is a root.
   * Should not be overwritten!
   */
  public mousePressed() {
    if (this.isSetup) {
      this.onMousePressed()
      this.transmit("mousePressed")
    } else {
      console.warn("mousePressed is called before setup")
    }
  }

  /**
   * Should only be called if the current entity is a root.
   * Should not be overwritten!
   */
  public mouseReleased() {
    if (this.isSetup) {
      this.onMouseReleased()
      this.transmit("mouseReleased")
    } else {
      console.warn("mousePressed is called before setup")
    }
  }

  /**
   * Should only be called if the current entity is a root.
   * Should not be overwritten!
   */
  public keyPressed() {
    if (this.isSetup) {
      this.onKeyPressed()
      this.transmit("keyPressed")
    } else {
      console.warn("keyPressed is called before setup")
    }
  }

  /**
   * Should only be called if the current entity is a root.
   * Should not be overwritten!
   */
  public keyReleased() {
    if (this.isSetup) {
      this.onKeyReleased()
      this.transmit("keyReleased")
    } else {
      console.warn("keyReleased is called before setup")
    }
  }

  public transmit(name: EntityEventName) {
    for (const listener of this.getListenersByName(name))
      listener.bind(this)(this)

    let children =
      name === "mouseReleased" ||
      name === "mousePressed" ||
      name === "keyPressed" ||
      name === "keyReleased"
        ? this.children.sort((a, b) => a.zIndex - b.zIndex)
        : this.children.sort((a, b) => b.zIndex - a.zIndex)

    for (const child of children) {
      if (this._stopPoints[name]) {
        this._stopPoints[name] = false
        return
      }

      child[name]()
    }
  }
}
