const { setupOverlay } = require("regl-shader-error-overlay");
setupOverlay();



const regl = require("regl")({
  pixelRatio: Math.min(window.devicePixelRatio, 2)
});
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

regl._gl.canvas.style="height: "+ window.innerHeight+"px";

regl.frame(function(context) {
  drawTriangle();
});
