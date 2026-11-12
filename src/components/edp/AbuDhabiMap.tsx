import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import satUrl from "@/assets/abudhabi_sat.jpg";
import heightUrl from "@/assets/abudhabi_height.png";
import { ABU_DHABI, APPS } from "@/lib/edp-apps";

// Imagery bounds (web-mercator tiles z9) — see assets.
const B = { w: 50.625, e: 56.953125, n: 26.431228, s: 22.593726 };
const W = 12, H = W * (1536 / 2304), LIFT = 0.3;
const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
function toXZ(lat: number, lon: number) {
  const u = (lon - B.w) / (B.e - B.w);
  const v = (merc(B.n) - merc(lat)) / (merc(B.n) - merc(B.s));
  return new THREE.Vector3((u - 0.5) * W, 0, (v - 0.5) * H);
}

const vert = `uniform sampler2D hmap; uniform float lift; varying vec2 vUv; varying float vH; varying vec3 vW;
void main(){ vUv=uv; float h=texture2D(hmap,uv).r; vH=h; vec3 p=position; p.z+=h*lift;
 vec4 w=modelMatrix*vec4(p,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`;
const frag = `uniform sampler2D sat; uniform float t; uniform vec3 focus; uniform float reveal; varying vec2 vUv; varying float vH; varying vec3 vW;
void main(){
 vec3 c=texture2D(sat,vUv).rgb; float l=dot(c,vec3(.299,.587,.114));
 float water=(1.-smoothstep(0.,.02,vH))*(1.-smoothstep(.18,.32,l));
 vec3 land=mix(vec3(.05,.08,.1),vec3(.85,.72,.5),pow(l,1.3))*1.1;
 vec3 sea=mix(vec3(.01,.04,.07),vec3(.05,.35,.4),l*2.);
 vec3 col=mix(land,sea,water);
 float ct=fract(vH*40.); col+=vec3(.25,.95,.85)*(1.-smoothstep(0.,.04,abs(ct-.5)-.46))*.25*(1.-water);
 vec2 g=abs(fract(vW.xz*2.)-.5); col+=vec3(.2,.8,.75)*(1.-smoothstep(0.,.02,min(g.x,g.y)))*.06;
 float d=length(vW.xz-focus.xz); col+=vec3(.25,.95,.8)*(1.-smoothstep(0.,.06,abs(d-mod(t*1.6,6.))))*.35*(1.-mod(t*1.6,6.)/6.);
 float r=1.-smoothstep(reveal-1.5,reveal,length(vW.xz));
 float edge=smoothstep(0.,.12,min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y)));
 gl_FragColor=vec4(col,r*edge);
}`;

function Pin({ i, pos, active, onHover }: { i: number; pos: THREE.Vector3; active: boolean; onHover: (i: number | null) => void }) {
  const head = useRef<THREE.Mesh>(null);
  const grp = APPS[i]!.group;
  const color = active ? "#f5c86b" : grp === "ai" ? "#7cc8ff" : grp === "catalogue" ? "#f5c86b" : "#4ff0cf";
  const h = 0.5 + (i % 4) * 0.18;
  useFrame(({ clock }) => {
    if (head.current) head.current.position.y = h + Math.sin(clock.elapsedTime * 2 + i) * 0.04;
  });
  return (
    <group position={pos}>
      <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[0.006, 0.006, h, 6]} /><meshBasicMaterial color={color} transparent opacity={active ? 0.9 : 0.45} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}><ringGeometry args={[0.05, 0.065, 32]} /><meshBasicMaterial color={color} transparent opacity={0.7} /></mesh>
      <mesh ref={head} scale={active ? 1.8 : 1}
        onPointerOver={(e) => { e.stopPropagation(); onHover(i); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { onHover(null); document.body.style.cursor = ""; }}>
        <octahedronGeometry args={[0.045, 0]} /><meshBasicMaterial color={color} />
      </mesh>
      {active && (
        <Html position={[0, h + 0.18, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full glass px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-foreground shadow-glow">{APPS[i]!.name}</div>
        </Html>
      )}
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: PointerEvent) => { mouse.current.x = e.clientX / window.innerWidth - 0.5; mouse.current.y = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener("pointermove", h); return () => window.removeEventListener("pointermove", h);
  }, []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime; const e = 1 - Math.pow(1 - Math.min(t / 4, 1), 3);
    const ang = -0.35 + (1 - e) * 1.2 + mouse.current.x * 0.35 + Math.sin(t * 0.1) * 0.05;
    const dist = 9 - e * 1.5, height = 9 - e * 4.2 - mouse.current.y * 1.2;
    const target = new THREE.Vector3(Math.sin(ang) * dist + 0.8, height, Math.cos(ang) * dist);
    const k = 1 - Math.exp(-3 * Math.min(dt, 0.05));
    camera.position.lerp(target, k); look.lerp(new THREE.Vector3(0.8, 0, 0), k); camera.lookAt(look);
  });
  return null;
}

function Terrain({ active, onHover }: { active: number | null; onHover: (i: number | null) => void }) {
  const [sat, hmap] = useLoader(THREE.TextureLoader, [satUrl, heightUrl]) as [THREE.Texture, THREE.Texture];
  sat.colorSpace = THREE.SRGBColorSpace; sat.anisotropy = 8;
  const focus = toXZ(ABU_DHABI.lat, ABU_DHABI.lon);
  const uniforms = useMemo(() => ({ sat: { value: sat }, hmap: { value: hmap }, lift: { value: LIFT }, t: { value: 0 }, focus: { value: focus }, reveal: { value: 0 } }), [sat, hmap]);
  const pins = useMemo(() => APPS.map((a) => toXZ(a.lat, a.lon)), []);
  const beacon = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime; const u = mat.current?.uniforms; if (u) { u["t"]!.value = t; u["reveal"]!.value = 1.5 + Math.min(t / 3, 1) * 12; }
    if (beacon.current) { const p = (t * 0.6) % 1; beacon.current.scale.setScalar(1 + p * 6); (beacon.current.material as THREE.MeshBasicMaterial).opacity = 1 - p; }
  });
  return (
    <group position={[-focus.x + 2.6, 0, -focus.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, H, 384, 256]} />
        <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vert} fragmentShader={frag} transparent />
      </mesh>
      <group position={focus}>
        <mesh ref={beacon} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}><ringGeometry args={[0.06, 0.075, 48]} /><meshBasicMaterial color="#f5c86b" transparent /></mesh>
        <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.01, 0.01, 1.8, 8]} /><meshBasicMaterial color="#f5c86b" transparent opacity={0.7} /></mesh>
      </group>
      {pins.map((p, i) => <Pin key={i} i={i} pos={p} active={active === i} onHover={onHover} />)}
    </group>
  );
}

export default function AbuDhabiMap({ active, onHover }: { active: number | null; onHover: (i: number | null) => void }) {
  return (
    <Canvas camera={{ position: [3, 12, 10], fov: 38 }} dpr={[1, 2]} flat gl={{ antialias: true, alpha: true }}>
      <Rig />
      <Terrain active={active} onHover={onHover} />
    </Canvas>
  );
}
