export type EntityEventName =
  | "setup"
  | "draw"
  | "update"
  | "teardown"
  | "mousePressed"
  | "mouseReleased"
  | "keyPressed"
  | "keyReleased"

export type EntityListener<This extends Entity> = (
  this: This,
  it: This
) => unknown

export class Entity {
  protected _isSetup = false
  protected _children = new Set<Entity>()
  protected _zIndex?: number
  protected _parent?: Entity
  protected _listeners: EntityListener<this>[] = []
  protected _stopPoints: Record<EntityEventName, boolean> = {
    setup: false,
    draw: false,
    update: false,
    teardown: false,
    keyPressed: false,
    keyReleased: false,
    mousePressed: false,
    mouseReleased: false,
  }

  get isSetup() {
    return this._isSetup
  }

  get children(): Array<Entity> {
    return [...this._children]
  }

  get zIndex(): number {
    return this._zIndex ?? this.parent?.children.indexOf(this) ?? 0
  }

  get parent(): Entity | undefined {
    return this._parent
  }

  /**
   * Represent any state-based entity
   */
  constructor() {}

  /**
   * Used to be overwritten by your own workings
   */
  onSetup() {}

  /**
   * Used to be overwritten by your own workings
   */
  onDraw() {}

  /**
   * Used to be overwritten by your own workings
   */
  onUpdate() {}

  /**
   * Used to be overwritten by your own workings
   */
  onTeardown() {}

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
  public setup() {
    if (!this.isSetup) {
      this.onSetup()
      this.transmit("setup")
      this._isSetup = true
    } else {
      throw new Error("Entity is already setup")
    }
  }

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
  public update() {
    if (this.isSetup) {
      this.onUpdate()
      this.transmit("update")
    } else {
      console.warn("update is called before setup")
    }
  }

  /**
   * Should only be called if the current entity is a root.
   * Should not be overwritten!
   */
  public teardown() {
    if (this.isSetup) {
      this._isSetup = false
      this.onTeardown()
      this._parent?.removeChild(this)
      this.transmit("teardown")
    } else {
      throw new Error("Entity must be setup before")
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

  public on(name: EntityEventName, listener: EntityListener<this>) {
    this._listeners.push(
      {
        [name]() {
          listener.bind(this)(this)
        },
      }[name].bind(this)
    )
  }

  public addChild(...children: Entity[]) {
    for (const child of children) {
      child._parent = this
      this._children.add(child)
      if (this.isSetup) child.setup()
    }
  }

  public removeChild(...children: Entity[]) {
    for (const child of children) {
      if (child.isSetup) child.teardown()
      else this._children.delete(child)
    }
  }

  public stopTransmission(name: EntityEventName) {
    this._stopPoints[name] = true
  }

  private transmit(name: EntityEventName) {
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

  private getListenersByName(name: EntityEventName) {
    return this._listeners.filter((listener) => {
      return listener.name === name
    })
  }

  public schema(
    indentation = 2,
    depth = 0,
    index: number | null = null
  ): string {
    return `${" ".repeat(indentation).repeat(depth)}${
      index === null ? "" : `${index} - `
    }${this.constructor.name} [${this.isSetup ? "on" : "off"}]${
      this._children.size > 0
        ? `:\n${this.children
            .map(
              (child, index) => `${child.schema(indentation, depth + 1, index)}`
            )
            .join("\n")}`
        : ""
    }`
  }
}
