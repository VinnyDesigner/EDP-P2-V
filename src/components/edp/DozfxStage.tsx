import { useEffect, useRef, useState } from "react";

export interface DozfxStageProps {
  /** Current morph target index (0..4) */
  shapeIndex: number;
  /** Continuous scroll progress (0..1) */
  scrollProgress: number;
  /** Short neon magenta flicker intensity (0..1) triggered on shape transitions */
  flicker: number;
  /** Active app index (adds subtle harmonic perturbation) */
  activeIndex: number | null;
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// Hand-coded WebGL ray-marched liquid chrome shader with:
// - 5 morphing SDF service shapes
// - Studio lighting rig: top-left softbox, right strip light, bottom #FF00FF magenta bounce
// - Chromatic dispersion + Fresnel studio reflections
// - Background warp starfield
const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uShapeA;
uniform float uShapeB;
uniform float uMix;
uniform float uScroll;
uniform float uFlicker;
uniform float uActivePulse;

#define MAX_STEPS 68
#define MAX_DIST 18.0
#define SURF_DIST 0.0018

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

// Smooth minimum for liquid chrome fusion
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdSphere(vec3 p, float s) {
  return length(p) - s;
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

float sdOctahedron(vec3 p, float s) {
  p = abs(p);
  float m = p.x + p.y + p.z - s;
  vec3 q;
  if (3.0 * p.x < m) q = p.xyz;
  else if (3.0 * p.y < m) q = p.yzx;
  else if (3.0 * p.z < m) q = p.zxy;
  else return m * 0.57735027;
  float k = clamp(0.5 * (q.z - q.y + s), 0.0, s);
  return length(vec3(q.x, q.y - s + k, q.z - k));
}

float sdBoxFrame(vec3 p, vec3 b, float e) {
  p = abs(p) - b;
  vec3 q = abs(p + e) - e;
  return min(min(
      length(max(vec3(p.x, q.y, q.z), 0.0)) + min(max(p.x, max(q.y, q.z)), 0.0),
      length(max(vec3(q.x, p.y, q.z), 0.0)) + min(max(q.x, max(p.y, q.z)), 0.0)),
      length(max(vec3(q.x, q.y, p.z), 0.0)) + min(max(q.x, max(q.y, p.z)), 0.0));
}

// 5 distinct service shapes that melt into one another
float evalShape(vec3 p, float idx, float t) {
  // Subtle organic liquid surface wave
  float wave = 0.045 * sin(p.x * 3.2 + t * 1.7) * cos(p.y * 2.9 - t * 1.3) * sin(p.z * 3.1 + t * 1.1);

  if (idx < 0.5) {
    // Shape 0: Liquid Agency Core (Morphing chrome metaballs + twisted ring)
    vec3 q = p;
    q.xz *= rot(t * 0.35);
    q.xy *= rot(t * 0.22);
    float ring = sdTorus(q, vec2(1.18, 0.28));
    vec3 b1 = vec3(sin(t * 1.1) * 0.95, cos(t * 0.85) * 0.75, sin(t * 0.7) * 0.65);
    vec3 b2 = vec3(cos(t * 0.95) * 0.9, sin(t * 1.25) * 0.8, cos(t * 1.15) * 0.6);
    vec3 b3 = vec3(sin(t * 0.75 + 2.0) * 0.75, cos(t * 1.3 + 1.0) * 0.85, sin(t * 0.95 - 1.2) * 0.75);
    float d = smin(ring, sdSphere(p - b1, 0.56), 0.55);
    d = smin(d, sdSphere(p - b2, 0.52), 0.55);
    d = smin(d, sdSphere(p - b3, 0.48), 0.52);
    d = smin(d, sdSphere(p, 0.72), 0.48);
    return d + wave;
  } else if (idx < 1.5) {
    // Shape 1: Brand & Identity / Platforms ("Out of chaos, structure")
    vec3 q = p;
    q.xz *= rot(t * 0.4);
    q.yz *= rot(t * 0.28);
    float oct = sdOctahedron(q, 1.58) - 0.08;
    float frame = sdBoxFrame(q, vec3(1.12), 0.14) - 0.04;
    float core = sdSphere(p, 0.78 + 0.12 * sin(t * 2.0));
    float d = smin(oct, frame, 0.35);
    d = smin(d, core, 0.42);
    return d + wave * 0.6;
  } else if (idx < 2.5) {
    // Shape 2: Websites, Products & AI Models (Gyroid-carved liquid sphere)
    vec3 q = p;
    q.xy *= rot(t * 0.3);
    q.xz *= rot(t * 0.45);
    float sph = sdSphere(q, 1.48);
    float gyr = abs(dot(sin(q * 3.15 + t * 0.8), cos(q.zxy * 3.15 - t * 0.6))) / 3.15 - 0.13;
    float shell = max(sph, gyr);
    float inner = sdSphere(p, 0.74);
    return smin(shell, inner, 0.28) + wave * 0.5;
  } else if (idx < 3.5) {
    // Shape 3: Campaigns, Telemetry & Orbital Rings
    vec3 q1 = p;
    q1.xy *= rot(t * 0.5 + 0.4);
    float t1 = sdTorus(q1, vec2(1.38, 0.21));
    vec3 q2 = p;
    q2.yz *= rot(-t * 0.42 + 1.1);
    float t2 = sdTorus(q2, vec2(1.02, 0.21));
    float core = sdSphere(p, 0.62);
    float d = smin(t1, t2, 0.38);
    return smin(d, core, 0.42) + wave * 0.7;
  } else {
    // Shape 4: AI Visibility & Synthesis Monolith (Twisted liquid prism)
    vec3 q = p;
    float twist = q.y * 1.15 + t * 0.5;
    q.xz *= rot(twist);
    float oct = sdOctahedron(q * vec3(1.0, 0.72, 1.0), 1.65) - 0.12;
    vec3 orb = vec3(cos(t * 1.4) * 1.15, sin(t * 1.1) * 0.65, sin(t * 1.4) * 1.15);
    float sat = sdSphere(p - orb, 0.45);
    float sat2 = sdSphere(p + orb, 0.42);
    float d = smin(oct, sat, 0.46);
    return smin(d, sat2, 0.46) + wave;
  }
}

float mapScene(vec3 p) {
  float t = uTime;
  // Pointer tilt
  vec3 q = p;
  q.xz *= rot(uMouse.x * 0.55);
  q.yz *= rot(uMouse.y * 0.45);

  // Subtle harmonic ripple when hovering an application
  float pulse = uActivePulse * 0.06 * sin(length(q) * 8.0 - t * 5.0);

  float dA = evalShape(q, uShapeA, t);
  float dB = evalShape(q, uShapeB, t);
  float m = smoothstep(0.0, 1.0, uMix);
  // Extra liquid stretch mid-transition
  float mid = sin(m * 3.14159265);
  float stretch = mid * 0.09 * sin(q.x * 5.0 + t * 4.0) * cos(q.y * 5.0 - t * 3.5);
  return mix(dA, dB, m) + stretch + pulse;
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0022, -0.0022);
  return normalize(
    e.xyy * mapScene(p + e.xyy) +
    e.yyx * mapScene(p + e.yyx) +
    e.yxy * mapScene(p + e.yxy) +
    e.xxx * mapScene(p + e.xxx)
  );
}

// Procedural studio environment reflection:
// - Softbox on top-left
// - Sharp strip light on the right
// - Signature #FF00FF magenta bounce from below
// - Subtle cyan/teal horizon accent
vec3 studioEnv(vec3 r, float flicker) {
  vec3 col = vec3(0.02, 0.02, 0.032);

  // Top-left studio softbox
  vec3 softboxDir = normalize(vec3(-0.65, 0.68, 0.34));
  float softbox = smoothstep(0.38, 0.92, dot(r, softboxDir));
  col += vec3(0.95, 0.97, 1.0) * pow(softbox, 2.2) * 1.65;

  // Right-side vertical strip light
  vec3 stripDir = normalize(vec3(0.86, 0.12, 0.48));
  float strip = smoothstep(0.62, 0.985, dot(r, stripDir));
  col += vec3(1.0, 0.98, 1.0) * pow(strip, 4.0) * 2.1;

  // Secondary high-contrast studio rib reflections (gives liquid chrome its signature banding)
  float bands = smoothstep(0.15, 0.85, sin(r.y * 11.0 + r.x * 4.0) * 0.5 + 0.5);
  col += vec3(0.16, 0.18, 0.24) * bands * 0.55;

  // Signature #FF00FF magenta neon bounce from below
  vec3 magDir = normalize(vec3(0.08, -0.88, 0.45));
  float magBounce = smoothstep(0.1, 0.92, dot(r, magDir));
  vec3 magenta = vec3(1.0, 0.0, 1.0);
  float magBoost = 1.15 + flicker * 1.85;
  col += magenta * pow(magBounce, 1.8) * magBoost;

  // Electric cyan/teal counter-rim on back-left
  vec3 cyanDir = normalize(vec3(-0.78, -0.22, -0.58));
  float cyanRim = smoothstep(0.25, 0.92, dot(r, cyanDir));
  col += vec3(0.0, 0.92, 0.86) * pow(cyanRim, 2.6) * 0.65;

  return col;
}

// Warp starfield in deep background
vec3 starfield(vec2 uv, float t, float scroll) {
  vec3 acc = vec3(0.0);
  vec2 p = uv;
  float warp = 0.35 + scroll * 1.4;
  for (int i = 1; i <= 3; i++) {
    float fi = float(i);
    vec2 q = p * (12.0 * fi);
    q.y += t * (0.35 * fi) + scroll * 6.0 * fi;
    vec2 id = floor(q);
    vec2 gv = fract(q) - 0.5;
    float n = fract(sin(dot(id, vec2(127.1 * fi, 311.7))) * 43758.5453);
    if (n > 0.92) {
      float size = (n - 0.92) * 12.0;
      float d = length(gv * vec2(1.0, 1.0 / (1.0 + warp * 0.6)));
      float spark = smoothstep(0.09 * size, 0.0, d);
      vec3 sCol = mix(vec3(0.75, 0.82, 1.0), vec3(1.0, 0.0, 1.0), fract(n * 17.3));
      acc += sCol * spark * (0.28 / fi);
    }
  }
  return acc;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);

  // Subtle camera shift as user scrolls
  vec3 ro = vec3(
    sin(uScroll * 3.14159) * 0.35 - 0.25,
    cos(uScroll * 3.14159) * 0.15,
    4.15
  );
  vec3 ta = vec3(0.22, 0.0, 0.0);
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = normalize(cross(uu, ww));
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.65 * ww);

  // Base dark obsidian background + warp starfield + subtle bottom magenta atmospheric glow
  vec3 bg = vec3(0.024, 0.024, 0.033);
  bg += starfield(uv, uTime, uScroll);
  float bottomGlow = smoothstep(1.1, -0.5, uv.y) * exp(-abs(uv.x - 0.2) * 1.6);
  bg += vec3(0.32, 0.0, 0.34) * bottomGlow * (0.22 + uFlicker * 0.35);

  // Ray-march the liquid chrome SDF
  float t = 0.0;
  float hit = 0.0;
  float minD = 99.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * t;
    float d = mapScene(p);
    minD = min(minD, d);
    if (d < SURF_DIST) {
      hit = 1.0;
      break;
    }
    if (t > MAX_DIST) break;
    t += d * 0.85;
  }

  vec3 col = bg;

  // Outer neon aura / halo around the chrome form
  float halo = exp(-max(minD, 0.0) * 5.2);
  col += mix(vec3(0.55, 0.0, 0.65), vec3(1.0, 0.0, 1.0), uFlicker) * halo * (0.22 + uFlicker * 0.45);

  if (hit > 0.5) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);
    vec3 v = -rd;
    vec3 r = reflect(-v, n);

    // Chromatic dispersion across R, G, B reflection vectors
    vec3 rR = reflect(-v, normalize(n + vec3(0.018, 0.0, -0.012)));
    vec3 rG = r;
    vec3 rB = reflect(-v, normalize(n - vec3(0.018, 0.0, -0.012)));

    vec3 envR = studioEnv(rR, uFlicker);
    vec3 envG = studioEnv(rG, uFlicker);
    vec3 envB = studioEnv(rB, uFlicker);
    vec3 refl = vec3(envR.r, envG.g, envB.b);

    // Fresnel rim (Schlick approximation for liquid mercury/chrome)
    float ndotv = clamp(dot(n, v), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 3.2);

    // Dark metallic core + bright studio reflection + magenta/white rim
    vec3 baseChrome = refl * (0.72 + 0.55 * fresnel);
    vec3 rimTint = mix(vec3(0.95, 0.96, 1.0), vec3(1.0, 0.0, 1.0), clamp(-n.y * 0.65 + 0.35 + uFlicker * 0.5, 0.0, 1.0));
    col = baseChrome + rimTint * fresnel * (0.55 + uFlicker * 0.65);

    // Occasional horizontal neon scanline glitch during shape flicker
    if (uFlicker > 0.02) {
      float scan = step(0.92, fract(sin(floor(gl_FragCoord.y * 0.35) + uTime * 35.0) * 43758.5453));
      col = mix(col, vec3(1.0, 0.0, 1.0), scan * uFlicker * 0.75);
    }
  }

  // Tone mapping (ACES-like curve) & subtle vignette
  col = col / (1.0 + col * 0.42);
  col = pow(max(col, vec3(0.0)), vec3(0.92));

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function DozfxStage({
  shapeIndex,
  scrollProgress,
  flicker,
  activeIndex,
}: DozfxStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    shapeA: 0,
    shapeB: 0,
    mix: 0,
    targetShape: 0,
    scroll: 0,
    flicker: 0,
    activePulse: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
  });

  useEffect(() => {
    const s = stateRef.current;
    if (shapeIndex !== s.targetShape) {
      // Snapshot current dominant shape and begin smooth liquid melt to new shapeIndex
      s.shapeA = s.mix > 0.5 ? s.shapeB : s.shapeA;
      s.shapeB = shapeIndex;
      s.mix = 0;
      s.targetShape = shapeIndex;
      s.flicker = Math.max(s.flicker, 1.0);
    }
  }, [shapeIndex]);

  useEffect(() => {
    stateRef.current.scroll = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (flicker > 0) {
      stateRef.current.flicker = Math.max(stateRef.current.flicker, flicker);
    }
  }, [flicker]);

  useEffect(() => {
    stateRef.current.activePulse = activeIndex !== null ? 1 : 0;
  }, [activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("Shader compile info:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uShapeA = gl.getUniformLocation(prog, "uShapeA");
    const uShapeB = gl.getUniformLocation(prog, "uShapeB");
    const uMix = gl.getUniformLocation(prog, "uMix");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uFlicker = gl.getUniformLocation(prog, "uFlicker");
    const uActivePulse = gl.getUniformLocation(prog, "uActivePulse");

    const resize = () => {
      // Render at capped DPR (max 1.5) for 60fps silky ray-marching performance
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      stateRef.current.targetMouseX = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      stateRef.current.targetMouseY = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let rafId = 0;
    const t0 = performance.now();

    const render = (now: number) => {
      const elapsed = (now - t0) * 0.001;
      const s = stateRef.current;

      s.mouseX += (s.targetMouseX - s.mouseX) * 0.06;
      s.mouseY += (s.targetMouseY - s.mouseY) * 0.06;
      s.mix = Math.min(1, s.mix + 0.022);
      s.flicker *= 0.91;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, s.mouseX, s.mouseY);
      gl.uniform1f(uShapeA, s.shapeA);
      gl.uniform1f(uShapeB, s.shapeB);
      gl.uniform1f(uMix, s.mix);
      gl.uniform1f(uScroll, s.scroll);
      gl.uniform1f(uFlicker, s.flicker);
      gl.uniform1f(uActivePulse, s.activePulse);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none h-full w-full block"
      aria-hidden="true"
    />
  );
}

/**
 * Interactive "Brand, set in ink" simulation inspired by dozfx lab:
 * Suspended chrome + magenta ink droplets on dark water that can be stirred with the cursor
 * or organized into the official wordmark when "Form" is pressed.
 */
export function InkWaterLab({ word = "DOZFX" }: { word?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [formed, setFormed] = useState(true);
  const [orderPct, setOrderPct] = useState(98.4);
  const [activeWord, setActiveWord] = useState(word);
  const formedRef = useRef(true);

  useEffect(() => {
    setActiveWord(word);
  }, [word]);

  useEffect(() => {
    formedRef.current = formed;
  }, [formed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 760;
    const H = 300;
    canvas.width = W;
    canvas.height = H;

    // Sample target points from an offscreen text canvas
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const octx = off.getContext("2d");
    const targets: { x: number; y: number; mag: boolean }[] = [];

    if (octx) {
      octx.clearRect(0, 0, W, H);
      octx.fillStyle = "#ffffff";
      octx.font = "900 116px Syne, Space Grotesk, sans-serif";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(activeWord, W / 2, H / 2);
      const img = octx.getImageData(0, 0, W, H).data;
      const step = 5;
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const a = img[(y * W + x) * 4 + 3] ?? 0;
          if (a > 128) {
            targets.push({ x, y, mag: Math.random() < 0.22 });
          }
        }
      }
    }

    const count = Math.max(targets.length, 450);
    const particles = Array.from({ length: count }, (_, i) => {
      const t = targets[i % Math.max(1, targets.length)] ?? {
        x: W * 0.5,
        y: H * 0.5,
        mag: false,
      };
      return {
        x: t.x + (Math.random() - 0.5) * 180,
        y: t.y + (Math.random() - 0.5) * 120,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        tx: t.x,
        ty: t.y,
        mag: t.mag,
        r: t.mag ? 2.1 : 1.65,
      };
    });

    const pointer = { x: -9999, y: -9999, active: false };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * W;
      pointer.y = ((e.clientY - rect.top) / Math.max(1, rect.height)) * H;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let tick = 0;
    const loop = () => {
      tick++;
      ctx.fillStyle = "rgba(7, 7, 11, 0.32)";
      ctx.fillRect(0, 0, W, H);

      let orderedCount = 0;
      const isFormed = formedRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        if (isFormed) {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx += dx * 0.065;
          p.vy += dy * 0.065;
          if (dx * dx + dy * dy < 36) orderedCount++;
        } else {
          // Suspended fluid swirl on water
          const angle =
            Math.sin(p.x * 0.012 + tick * 0.02) * Math.cos(p.y * 0.015 - tick * 0.018) * Math.PI * 2;
          p.vx += Math.cos(angle) * 0.22;
          p.vy += Math.sin(angle) * 0.22;
        }

        if (pointer.active) {
          const mx = p.x - pointer.x;
          const my = p.y - pointer.y;
          const d2 = mx * mx + my * my;
          if (d2 < 4200 && d2 > 1) {
            const f = (1 - d2 / 4200) * 4.2;
            const inv = 1 / Math.sqrt(d2);
            p.vx += mx * inv * f;
            p.vy += my * inv * f;
          }
        }

        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap softly when dispersed
        if (!isFormed) {
          if (p.x < 10) p.vx += 0.8;
          if (p.x > W - 10) p.vx -= 0.8;
          if (p.y < 10) p.vy += 0.8;
          if (p.y > H - 10) p.vy -= 0.8;
        }

        ctx.fillStyle = p.mag ? "#ff00ff" : "#f4f5f8";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (tick % 8 === 0) {
        setOrderPct(Number(((orderedCount / Math.max(1, particles.length)) * 100).toFixed(1)));
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [activeWord]);

  return (
    <div className="relative overflow-hidden border border-white/12 bg-[#07070b]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-[#ff00ff] shadow-[0_0_12px_#ff00ff]" />
          <span>DOZFX LAB · BRAND, SET IN INK</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/80 tabular-nums">ORDER {orderPct.toFixed(1)}%</span>
          <span className="hidden text-white/40 sm:inline">DRAG WATER TO STIR</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="h-[240px] w-full cursor-crosshair block sm:h-[290px]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07070b] to-transparent" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFormed(true)}
            className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] transition ${
              formed
                ? "bg-[#ff00ff] text-black font-semibold shadow-[0_0_24px_rgba(255,0,255,0.5)]"
                : "border border-white/20 text-white/70 hover:border-white/50 hover:text-white"
            }`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => setFormed(false)}
            className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] transition ${
              !formed
                ? "bg-white text-black font-semibold"
                : "border border-white/20 text-white/70 hover:border-white/50 hover:text-white"
            }`}
          >
            Disperse Ink
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
          <span className="text-white/40">MARK:</span>
          {(["DOZFX", "EAD · EDP", "LIQUID"] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => {
                setActiveWord(w);
                setFormed(true);
              }}
              className={`px-2.5 py-1 transition ${
                activeWord === w
                  ? "border border-[#ff00ff] text-[#ff00ff]"
                  : "border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

