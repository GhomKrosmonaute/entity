const createContext = require("gl")
// overwrite getContext to return headless-gl webgl context
const orig_getContext = window.HTMLCanvasElement.prototype.getContext
window.HTMLCanvasElement.prototype.getContext = function () {
  if (arguments[0] === "webgl") {
    // create headless-gl GL context
    const ctx = createContext(1, 1, arguments[1])
    // insert the resize method to the context so that lcjs package can use it
    ctx.resize = ctx.getExtension("STACKGL_resize_drawingbuffer").resize
    return ctx
  } else {
    return orig_getContext.apply(this, arguments)
  }
}
