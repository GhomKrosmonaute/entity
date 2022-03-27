/**
 * @jest-environment jsdom
 */

const { ApplicationEntity } = require("../dist")

test("make app", (done) => {
  new ApplicationEntity(
    {
      width: 200,
      height: 200,
      forceCanvas: true,
    },
    (app) => {
      app.destroy(true)
      done()
    }
  )
})
