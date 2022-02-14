export type EntityEventName = "setup" | "update" | "teardown"

export type EntityListener<
  EventName extends string,
  This extends Base<EventName>
> = (this: This, it: This) => unknown

export class Base<EventName extends string> {
  protected _isSetup = false
  protected _children = new Set<Base<EventName | EntityEventName>>()
  protected _parent?: Base<EventName | EntityEventName>
  protected _listeners: EntityListener<EventName | EntityEventName, this>[] = []
  protected _stopPoints: Partial<Record<EventName | EntityEventName, boolean>> =
    {}

  get isSetup() {
    return this._isSetup
  }

  get children(): Array<Base<EventName | EntityEventName>> {
    return [...this._children]
  }

  get parent(): Base<EventName | EntityEventName> | undefined {
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
  onUpdate() {}

  /**
   * Used to be overwritten by your own workings
   */
  onTeardown() {}

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

  public on(name: EventName, listener: EntityListener<EventName, this>) {
    this._listeners.push(
      {
        [name]() {
          listener.bind(this)(this)
        },
      }[name].bind(this)
    )
  }

  public addChild(...children: Base<EventName>[]) {
    for (const child of children) {
      child._parent = this
      this._children.add(child)
      if (this.isSetup) child.setup()
    }
  }

  public removeChild(...children: Base<EventName>[]) {
    for (const child of children) {
      if (child.isSetup) child.teardown()
      else this._children.delete(child)
    }
  }

  protected stopTransmission(name: EventName | EntityEventName) {
    this._stopPoints[name] = true
  }

  protected transmit(name: EventName | EntityEventName) {
    for (const listener of this.getListenersByName(name))
      listener.bind(this)(this)

    for (const child of this.children) {
      if (this._stopPoints[name]) {
        this._stopPoints[name] = false
        return
      }

      // @ts-ignore
      child[name]()
    }
  }

  protected getListenersByName(name: EventName | EntityEventName) {
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
