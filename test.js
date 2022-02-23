const { ApplicationEntity } = require("./dist/index")

test("make app", (cb) => {
  new ApplicationEntity()
  cb()
})
