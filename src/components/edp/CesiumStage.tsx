import { useEffect, useRef } from "react";
import { APPS } from "@/lib/edp-apps";

// Cesium loaded from its CDN build at runtime (no bundling, no ion token).
// Terrain: Esri World Elevation 3D. Imagery: Esri World Imagery.
const BASE = "https://cdn.jsdelivr.net/npm/cesium@1.123/Build/Cesium/";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type C = any;

export type Shot = { lon: number; lat: number; h: number; heading: number; pitch: number };
/** Shared, mutable scroll position in keyframe units (e.g. 2.4 = 40% between shot 2 and 3). */
export type ScrollCursor = { current: number };

function loadCesium(): Promise<C> {
  const w = window as unknown as { Cesium?: C; __cesiumP?: Promise<C>; CESIUM_BASE_URL?: string };
  if (w.Cesium) return Promise.resolve(w.Cesium);
  if (w.__cesiumP) return w.__cesiumP;
  w.CESIUM_BASE_URL = BASE;
  const css = document.createElement("link"); css.rel = "stylesheet"; css.href = BASE + "Widgets/widgets.css"; document.head.appendChild(css);
  w.__cesiumP = new Promise((res, rej) => {
    const s = document.createElement("script"); s.src = BASE + "Cesium.js"; s.async = true;
    s.onload = () => res(w.Cesium); s.onerror = rej; document.head.appendChild(s);
  });
  return w.__cesiumP;
}

const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpAng = (a: number, b: number, t: number) => { let d = ((b - a + 540) % 360) - 180; return a + d * t; };

export default function CesiumStage({ shots, cursor, active }: { shots: Shot[]; cursor: ScrollCursor; active: number | null }) {
  const el = useRef<HTMLDivElement>(null);
  const v = useRef<{ Cesium: C; ents: C[] } | null>(null);

  useEffect(() => {
    let dead = false; let viewer: C = null;
    loadCesium().then(async (Cesium) => {
      if (dead || !el.current) return;
      viewer = new Cesium.Viewer(el.current, {
        baseLayer: false, animation: false, timeline: false, baseLayerPicker: false, geocoder: false, homeButton: false,
        sceneModePicker: false, navigationHelpButton: false, fullscreenButton: false, infoBox: false, selectionIndicator: false,
        creditContainer: document.createElement("div"), msaaSamples: 1, useBrowserRecommendedResolution: true,
      });
      viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 1.5);
      const s = viewer.scene;
      const img = await Cesium.ArcGisMapServerImageryProvider.fromUrl("https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
      const layer = viewer.imageryLayers.addImageryProvider(img);
      // warm, cinematic grade — not washed out
      layer.brightness = 1.0; layer.contrast = 1.25; layer.saturation = 0.6; layer.gamma = 1.0;
      Cesium.ArcGISTiledElevationTerrainProvider.fromUrl("https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer")
        .then((t: C) => { if (!dead) s.terrainProvider = t; });
      s.verticalExaggeration = 2.2;
      s.globe.maximumScreenSpaceError = 1.5; // sharper tiles
      s.globe.tileCacheSize = 400;
      s.globe.preloadSiblings = true;
      s.globe.enableLighting = false;
      s.globe.showGroundAtmosphere = true;
      s.globe.baseColor = Cesium.Color.fromCssColorString("#0b2226");
      s.backgroundColor = Cesium.Color.fromCssColorString("#0b1d21");
      s.skyAtmosphere.hueShift = 0.04; s.skyAtmosphere.saturationShift = -0.3; s.skyAtmosphere.brightnessShift = -0.1;
      s.fog.enabled = true; s.fog.density = 0.00008; s.requestRenderMode = false;
      s.postProcessStages.fxaa.enabled = true;
      // EDP brand grade: deep-teal duotone with sand highlights, relief-preserving, soft vignette
      s.postProcessStages.add(new Cesium.PostProcessStage({ fragmentShader: `
        uniform sampler2D colorTexture; in vec2 v_textureCoordinates;
        void main(){
          vec3 c = texture(colorTexture, v_textureCoordinates).rgb;
          float l = dot(c, vec3(0.299,0.587,0.114));
          l = smoothstep(0.02, 0.85, l);
          vec3 lo = vec3(0.03,0.11,0.13), mid = vec3(0.18,0.47,0.50), hi = vec3(0.93,0.95,0.90);
          vec3 d = l < 0.5 ? mix(lo, mid, l*2.0) : mix(mid, hi, (l-0.5)*2.0);
          vec3 col = mix(d, c, 0.22);
          vec2 q = v_textureCoordinates - 0.5; col *= 1.0 - dot(q,q)*0.9;
          out_FragColor = vec4(col, 1.0);
        }` }));
      const sc = s.screenSpaceCameraController; sc.enableInputs = false; // camera is driven by scroll

      const gold = Cesium.Color.fromCssColorString("#dff1f2");
      const ents = APPS.map((a) => viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(a.lon, a.lat, 0),
        point: { pixelSize: 6, color: gold, outlineColor: Cesium.Color.fromCssColorString("#0b1d21"), outlineWidth: 1.5,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Number.POSITIVE_INFINITY },
        polyline: { positions: Cesium.Cartesian3.fromDegreesArrayHeights([a.lon, a.lat, 0, a.lon, a.lat, 9000]), width: 1,
          material: gold.withAlpha(0.55) },
      }));
      v.current = { Cesium, ents };

      // scroll-tracked camera, smoothed every frame
      let cur = cursor.current;
      s.preRender.addEventListener(() => {
        cur += (cursor.current - cur) * 0.08;
        const n = shots.length - 1; const k = Math.max(0, Math.min(n, cur));
        const i = Math.min(Math.floor(k), n - 1); const t = ease(k - i);
        const a = shots[i]!, b = shots[i + 1]!;
        const h = Math.exp(lerp(Math.log(a.h), Math.log(b.h), t));
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(lerp(a.lon, b.lon, t), lerp(a.lat, b.lat, t), h),
          orientation: { heading: Cesium.Math.toRadians(lerpAng(a.heading, b.heading, t)), pitch: Cesium.Math.toRadians(lerp(a.pitch, b.pitch, t)), roll: 0 },
        });
      });
      el.current.parentElement?.setAttribute("data-scene-ready", "1");
    }).catch((e) => console.error("Cesium failed to load", e));
    return () => { dead = true; viewer?.destroy(); v.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    v.current?.ents.forEach((e: C, i: number) => { e.point.pixelSize = i === active ? 14 : 6; });
  }, [active]);

  return <div ref={el} className="h-full w-full [&_.cesium-viewer-bottom]:hidden" />;
}
