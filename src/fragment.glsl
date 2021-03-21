precision highp float;
uniform float t;
uniform float scroll;
uniform vec2 resolution;

varying vec2 uv;

// clang-format off
#pragma glslify: squareFrame = require("glsl-square-frame")
#pragma glslify: worley2D = require(glsl-worley/worley2D.glsl)
#pragma glslify: hsv2rgb = require('glsl-hsv2rgb')
#pragma glslify: luma = require(glsl-luma)
#pragma glslify: smin = require(glsl-smooth-min)
#pragma glslify: fbm3d = require('glsl-fractal-brownian-noise/3d')
#pragma glslify: noise = require('glsl-noise/simplex/3d')
#pragma glslify: gauss = require('glsl-specular-gaussian')

// clang-format on
#define PI 3.14159265359

float random(in vec2 _st) {
  return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 18.5453);
}

vec2 pixel = vec2(1.0) / resolution;
vec3 voronoi(in vec2 x) {
  vec2 n = floor(x);
  vec2 f = fract(x);

  vec3 m = vec3(8.0);
  float f2 = 80.0;
  for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash(n + g);
      // vec2  r = g - f + o;
      vec2 r = g - f + (0.5 + 0.5 * sin(6.2831 * o));
      float d = dot(r, r);
      if (d < m.x) {
        f2 = m.x;
        m = vec3(d, o);
      } else if (d < f2) {
        f2 = d;
      }
    }

  return vec3(sqrt(m.x), sqrt(f2), m.y + m.z);
}

void main() {
  vec2 pos = squareFrame(resolution);

  float normScroll = scroll/resolution.y;
  vec3 color;
pos.y -= normScroll*2.0;
pos.y = mod(pos.y,1.0);
// pos.y -= normScroll, 1.0)-0.5;
  float m = 100.;
  float scale = min(resolution.x/4.,200.);
  vec3 c = voronoi(scale * pos);

  float h = c.z * 500.;
  // h = floor(c.z*20.);

  float dilation = noise(vec3(
    //  pos * vec2(0,1.0) +
      vec2(0.,  h),  normScroll + sin(t*0.1)*0.02)

  );

  vec3 eyePosition = vec3(0.,0.,  2.0);
  vec3 lightPosition = vec3(-1., 0.0, -2.0);

  vec3 surfacePosition = vec3((pos*0.1 ) ,0.0);

  float  angleRange = 2.;
  vec3 surfaceNormal = vec3(
    sin(dilation*3.6)*angleRange,
    cos(dilation*3.6)*angleRange,
    1.);

  vec3 eyeDirection = normalize(eyePosition - surfacePosition);
  vec3 lightDirection = normalize(lightPosition - surfacePosition);
  vec3 normal = normalize(surfaceNormal);

  float shininess = 0.5;
  float power = gauss(lightDirection, eyeDirection, normal, shininess);

float p = power* power*power*power*3.;
  color = hsv2rgb(vec3(c.z, 0.5, 1.0)) * p;

  gl_FragColor = vec4(color, 1.0);
}