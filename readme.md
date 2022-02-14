# Entity p5

TypeScript only package for entity based app using p5.js

## Library usage

Start from templte ? https://github.com/ESBuildTemplates/entity-p5.ts (recommended)

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
    height,
    {
      stroke: false,
      fill: color("red")
    }
  )
  
  // add my rect to root entity children.
  // my rect will drawn/setup/update/teardown at same time of root.
  root.addChild(myRect)
  
  root.setup()
}

function draw() {
  root.update()
  root.draw()
}
```

### Example with heritage

The following class uses the onDraw method of her parent.  
The onDraw method is already implemented in some entities. 

```ts
// TypeScript
import { Entity, Circle } from "@ghom/entity-p5"

/**
 * Juste a clickable balloon that teleports
 */
export class ClickableBalloon extends Circle {
  constructor() {
    super(random(0, width), random(0, height), random(40, 60), {
      fill: color(random(100, 200), random(100, 200), random(100, 200)),
      stroke: false,
    })
  }

  onUpdate() {
    if (this.isHovered) {
      this.settings.stroke = {
        color: color(255),
        weight: 5,
      }
    } else {
      this.settings.stroke = false
    }
  }

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
      this.addChild(new Balloon())
    }
  }
}
```
