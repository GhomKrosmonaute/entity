# Entity p5

Suitable to be included in a bundle for Node and the browser for entity based app using p5.js

## Library usage

Start from template ? [https://github.com/ESBuildTemplates/entity-p5.ts](ESBuildTemplates/entity-p5.ts) (recommended)

### Startup example

The following Rect instance extends Entity

```ts
// TypeScript
import { Entity, Rect } from "@ghom/entity-p5"

/**
 * It is recommended to isolate root entity in another file to be able to import it wherever you want
 */
const root = new Entity

function setup() {
  const myRect = new Rect(
    x, y,
    width,
    height
  ).setStyle(() => {
    noStroke()
    fill("red")
  })
  
  // add my rect to root entity children.
  // my rect will drawn/setup/update/teardown at same time of root.
  root.addChild(myRect)
  
  root.setup()
}

function draw() {
  root.update(true)
  root.draw()
}
```

### Example with heritage

The following class uses the onUpdate method of her parent.  
The onDraw method is already implemented in some entities. 

```ts
// TypeScript
import { Entity, Circle } from "@ghom/entity-p5"

/**
 * Juste a clickable balloon that teleports
 */
export class ClickableBalloon extends Circle {
  constructor() {
    super(
      random(0, width),  // x
      random(0, height), // y
      random(40, 60)     // diameter
    )
  }

  /**
   * Setup dynamic styles
   */
  onSetup() {
    this.setStyle(() => {
      fill(
        random(100, 200), // red
        random(100, 200), // green
        random(100, 200)  // blue
      )
      if(this.isHovered) {
        stroke(255)
        strokeWeight(5)
      } else noStroke()
    })
  }

  /**
   * Prevent the user from being able to click on multiple balloons at the same time
   */
  onMouseReleased() {
    if (this.isHovered) {
      if (this.parent.children.length > 1)
        this.parent.stopTransmission("mouseReleased")

      this.parent.addChild(new Balloon())
      this.teardown()
    }
  }
}

/**
 * It is an Entity used as container containing other entities
 */
export class Balloons extends Entity {
  constructor(private count: number) {
    super()
  }

  onSetup() {
    for (let i = 0; i < this.count; i++) {
      this.addChild(new ClickableBalloon())
    }
  }
}
```
