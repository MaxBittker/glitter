const { setupOverlay } = require("regl-shader-error-overlay");
setupOverlay();
// let CCapture = require("ccapture.js");
// var capturer = new CCapture({ format: "webm", framerate: 60 });

function downloadURI(uri, filename) {
  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const regl = require("regl")({
  pixelRatio: Math.min(window.devicePixelRatio, 2)
});
// const { setupWebcam } = require("./src/regl-webcam");
let shaders = require("./src/pack.shader.js");
let vert = shaders.vertex;
let frag = shaders.fragment;

shaders.on("change", () => {
  console.log("update");
  vert = shaders.vertex;
  frag = shaders.fragment;
  let overlay = document.getElementById("regl-overlay-error");
  overlay && overlay.parentNode.removeChild(overlay);
});

// const lastFrame = regl.texture();
// const pixels = regl.texture();
// let ct;
// let last27 = [0, 0];
// let last32 = [0, 0];
// let cam = setupWebcam({
// regl,
// done: (webcam, { videoWidth, videoHeight, ctracker }) => {
// ct = ctracker;
// window.ct = ct;
// console.log(ct);
// console.log(ctracker.getCurrentPosition())
// console.log(ctracker.getCurrentPosition())
let drawTriangle = regl({
  uniforms: {
    // webcam,
    // videoResolution: [videoWidth, videoHeight],
    // Becomes `uniform float t`  and `uniform vec2 resolution` in the shader.
    t: ({ tick }) => tick,
    resolution: ({ viewportWidth, viewportHeight }) => [
      viewportWidth,
      viewportHeight
    ],
    scroll:()=>window.scrollY,
    // backBuffer: lastFrame
    // "eyes[0]": () => {
    //   // let positions = ct.getCurrentPosition();
    //   if (positions) {
    //     last27 = positions[27];
    //     return positions[27];
    //   } else {
    //     return last27;
    //   }
    // },
    // "eyes[1]": () => {
    //   // let positions = ct.getCurrentPosition();
    //   if (positions) {
    //     last32 = positions[32];
    //     return positions[32];
    //   } else {
    //     return last32;
    //   }
    // }
  },

  frag: () => shaders.fragment,
  vert: () => shaders.vertex,
  attributes: {
    // Full screen triangle
    position: [
      [-1, 4],
      [-1, -1],
      [4, -1]
    ]
  },
  // Our triangle has 3 vertices
  count: 3
});

// capturer.start();
// let f = 0;
regl._gl.canvas.style="height: "+ window.innerHeight+"px";
regl.frame(function(context) {
  // regl.clear({
  // color: [0, 0, 0, 0]
  // });
  drawTriangle();
  // lastFrame({
  //   copy: true
  // });
  // debugger;
  // f++;
  // if (f < 60 * 5 && f % 2) {
  // f++;
  // downloadURI(
  // regl._gl.canvas.toDataURL(),
  // `chlor-frame-${(f / 2).toString().padStart(8, "0")}.png`
  // );/
  // } else {
  // capturer.stop();
  // default save, will download automatically a file called {name}.extension (webm/gif/tar)
  // capturer.save();
  // }
});
// }
// });
