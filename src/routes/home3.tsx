import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import {
  ArrowUpRight,
  Command,
  Grid,
  MessageCircle,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { APPS, type AppGroup } from "@/lib/edp-apps";
import Lenis from "lenis";
import { InkWaterLab } from "@/components/edp/DozfxStage";

const DozfxStage = lazy(() => import("@/components/edp/DozfxStage"));

export const Route = createFileRoute("/home3")({
  head: () => ({
    meta: [
      {
        title:
          "dozfx × EAD — A Liquid Agency & Environmental Intelligence Portal",
      },
      {
        name: "description",
        content:
          "Human taste. Machine speed. Hand-coded WebGL ray-marched liquid chrome, √φ mathematical typography, and 24 environmental platforms & AI models.",
      },
      {
        property: "og:title",
        content: "dozfx × EAD — Human Taste. Machine Speed.",
      },
      {
        property: "og:description",
        content:
          "A liquid agency & environmental intelligence portal with live ray-marched 3D chrome.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&family=Cairo:wght@400;600;700&display=swap",
      },
    ],
  }),
  component: Home3,
});

const pad = (n: number) => String(n).padStart(2, "0");

type Filter = "all" | AppGroup;
type Edition = "hybrid" | "dozfx";

interface ServiceItem {
  id: number;
  code: string;
  shapeName: string;
  dozfxTitle: string;
  dozfxSub: string;
  dozfxDesc: string;
  edpTitle: string;
  edpSub: string;
  edpDesc: string;
  deliverables: string[];
}

const SERVICES: ServiceItem[] = [
  {
    id: 0,
    code: "01",
    shapeName: "METABALL TORUS",
    dozfxTitle: "Brand and identity",
    dozfxSub: "Out of chaos, structure.",
    dozfxDesc:
      "Visual foundations, verbal identity, design systems, and distinctive brand markers engineered to hold their edge across every surface.",
    edpTitle: "Core Environmental Platforms",
    edpSub: "Out of raw telemetry, structure.",
    edpDesc:
      "Nine integrated Abu Dhabi portals unifying air quality, marine biodiversity, geospatial mapping, and citizen engagement under one tokenized system.",
    deliverables: ["Identity Systems", "Design Tokens", "Motion Language", "3D Marks"],
  },
  {
    id: 1,
    code: "02",
    shapeName: "CRYSTAL OCTAHEDRON",
    dozfxTitle: "Websites and digital products",
    dozfxSub: "Zero-bloat interfaces at machine speed.",
    dozfxDesc:
      "Journeys, interfaces, web apps, commerce, and prompt-editable digital products with hand-coded WebGL and sub-50KB runtime budgets.",
    edpTitle: "Satellite & SAR AI Models",
    edpSub: "Orbital vision at machine speed.",
    edpDesc:
      "Fifteen specialized computer-vision and remote-sensing models tracking oil spills, marine debris, algal blooms, and coastline change in real time.",
    deliverables: ["WebGL / Ray-Marching", "Design Grids", "Web Apps", "AI Interfaces"],
  },
  {
    id: 2,
    shapeName: "GYROID LATTICE",
    code: "03",
    dozfxTitle: "Campaigns and content",
    dozfxSub: "Film, photography & 3D visualisations.",
    dozfxDesc:
      "Multi-format rollouts, key visuals, ray-marched product films, and high-impact launch assets orchestrated from a single creative core.",
    edpTitle: "Marine & Underwater Vision",
    edpSub: "Sub-surface habitat & species intelligence.",
    edpDesc:
      "Automated video classification for Jaywun marine habitats, fish species identification, dredging detection, and outfall monitoring.",
    deliverables: ["3D Visualisation", "Key Visuals", "Motion Studies", "Launch Rollouts"],
  },
  {
    id: 3,
    shapeName: "ORBITAL HYPER-RINGS",
    code: "04",
    dozfxTitle: "AI visibility (GEO)",
    dozfxSub: "Engineered for generative discovery.",
    dozfxDesc:
      "Structuring brand entities, semantic authority, and machine-readable knowledge graphs so generative engines cite and surface you first.",
    edpTitle: "Terrestrial & Wildlife AI",
    edpSub: "Biodiversity indexed across land & sky.",
    edpDesc:
      "Camera trap species recognition, bird and nest counting, tree species detection, and vegetation cover mapping across the emirate.",
    deliverables: ["Entity Architecture", "Semantic Schemas", "AI Indexing", "Telemetry"],
  },
  {
    id: 4,
    shapeName: "TWISTED MONOLITH",
    code: "05",
    dozfxTitle: "Creative retainer",
    dozfxSub: "Your external liquid creative department.",
    dozfxDesc:
      "Direct senior creative direction by Thomas 'Joe' Hahn paired with a specialist network and AI-accelerated production—without agency overhead.",
    edpTitle: "Geospatial Synthesis & Avatar",
    edpSub: "Conversational & predictive synthesis.",
    edpDesc:
      "Interactive EAD Avatar, bilingual AI assistant, and Al Daleela geospatial synthesis connecting policymakers and citizens within seconds.",
    deliverables: ["Senior Direction", "12h Turnaround", "Continuous Ship", "R&D Lab"],
  },
];

const SHOWCASE_CASES = [
  {
    code: "CASE · 01",
    client: "Fraud Fight Club",
    category: "Brand Identity · Event Platform · WebGL",
    year: "2025",
    metric: "140ms Warp Transitions",
    summary:
      "End-to-end visual identity, kinetic web platform, and stage motion package for an invite-only global payments & fraud intelligence summit.",
    shape: 1,
  },
  {
    code: "CASE · 02",
    client: "Merchant Fraud Alliance",
    category: "Design System · Digital Product · GEO",
    year: "2025",
    metric: "√φ Token Architecture",
    summary:
      "Tokenized 12-column editorial & intelligence platform uniting global merchant risk teams with instant zero-bloat search.",
    shape: 2,
  },
  {
    code: "CASE · 03",
    client: "epay Global Payments",
    category: "Campaigns · 3D Chrome Visuals · Commerce",
    year: "2024",
    metric: "48KB Core Runtime",
    summary:
      "Multi-market launch rollout, ray-marched chrome key visuals, and modular digital product system across Europe and MENA.",
    shape: 3,
  },
  {
    code: "CASE · 04",
    client: "EAD Enviroportal & AI Suite",
    category: "Geospatial Intelligence · 24 Systems",
    year: "2025",
    metric: "09 Platforms · 15 AI Models",
    summary:
      "Unified environmental command interface connecting satellite SAR oil-spill detection, air quality telemetry, and biodiversity models.",
    shape: 4,
  },
];

const TYPE_SCALE = [
  { step: "T+5", ratio: "φ² · 3.33×", px: "56.6px", role: "Hero Display (PolySans / Syne Bulky)" },
  { step: "T+4", ratio: "φ¹·⁵ · 2.62×", px: "44.5px", role: "Section Header" },
  { step: "T+3", ratio: "φ¹ · 2.06×", px: "35.0px", role: "Case Study Title" },
  { step: "T+2", ratio: "√φ² · 1.62×", px: "27.5px", role: "Lead Statement" },
  { step: "T+1", ratio: "√φ · 1.272×", px: "21.6px", role: "Subhead / Card Title" },
  { step: "BASE", ratio: "1.000×", px: "17.0px", role: "Running Body (Space Grotesk)" },
  { step: "T-1", ratio: "1/√φ · 0.786×", px: "13.4px", role: "Secondary Meta" },
  { step: "T-2", ratio: "1/φ · 0.618×", px: "10.5px", role: "System Micro Label" },
];

function AppIcon({ name, className }: { name: string; className?: string }) {
  const I =
    (
      Icons as unknown as Record<
        string,
        React.ComponentType<{ className?: string | undefined }>
      >
    )[name] ?? Icons.Sparkles;
  return <I className={className} />;
}

/**
 * Animated Striped "D" Logo Mark (SVG + CSS stripes inspired by dozfx.com)
 */
function StripedDLogo({ flicker }: { flicker: boolean }) {
  return (
    <svg
      viewBox="0 0 44 44"
      className="h-9 w-9 shrink-0 overflow-visible"
      aria-label="dozfx striped D mark"
    >
      <defs>
        <clipPath id="dozfx-d-clip">
          <path d="M6 4 H23 C33.5 4 40 11.2 40 22 C40 32.8 33.5 40 23 40 H6 Z M15 12.5 V31.5 H22.5 C28.2 31.5 31.5 27.8 31.5 22 C31.5 16.2 28.2 12.5 22.5 12.5 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#dozfx-d-clip)">
        <rect x="0" y="0" width="44" height="44" fill="#0b0b10" />
        {Array.from({ length: 11 }).map((_, i) => (
          <rect
            key={i}
            x="0"
            y={i * 4 + 1}
            width="44"
            height="2.3"
            fill={
              flicker && i % 3 === 0
                ? "#ff00ff"
                : i === 4 || i === 8
                ? "#ff00ff"
                : "#f5f6fa"
            }
            className="transition-all duration-300"
          />
        ))}
      </g>
    </svg>
  );
}

function Home3() {
  const [edition, setEdition] = useState<Edition>("hybrid");
  const [shapeIndex, setShapeIndex] = useState(0);
  const [flicker, setFlicker] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [gridOpen, setGridOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [activeApp, setActiveApp] = useState<number | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [briefSent, setBriefSent] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [ar, setAr] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCycle, setAutoCycle] = useState(true);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const pointerPos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const triggerShape = (nextShape: number, pauseAuto = false) => {
    if (pauseAuto) setAutoCycle(false);
    setShapeIndex(nextShape);
    setFlicker(1.0);
  };

  // Smooth inertial scrolling via Lenis
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    let rafId = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Auto-morph hero service shapes every 5.5s with a short magenta neon flicker
  useEffect(() => {
    if (!autoCycle) return;
    const timer = window.setInterval(() => {
      setShapeIndex((prev) => (prev + 1) % 5);
      setFlicker(1.0);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [autoCycle]);

  // Decay local UI flicker state
  useEffect(() => {
    if (flicker <= 0) return;
    const id = window.setTimeout(() => setFlicker(0), 280);
    return () => window.clearTimeout(id);
  }, [flicker]);

  // Scroll progress & keyboard shortcuts ('G' for 12-col design grid, Cmd/Ctrl+K for search)
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      const isInput =
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement | null)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setBriefOpen(false);
        return;
      }
      if (!isInput && !e.metaKey && !e.ctrlKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        setGridOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Smooth cursor-following preview card for the 24 EAD apps
  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      pointerPos.current.tx = e.clientX;
      pointerPos.current.ty = e.clientY;
    };
    const loop = () => {
      const p = pointerPos.current;
      p.x += (p.tx - p.x) * 0.16;
      p.y += (p.ty - p.y) * 0.16;
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${p.x + 28}px, ${p.y - 110}px, 0) rotate(${(p.tx - p.x) * 0.035}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const filteredApps = useMemo(
    () =>
      APPS.map((a, i) => ({ ...a, i })).filter(
        (a) => filter === "all" || a.group === filter
      ),
    [filter]
  );

  const searchResults = useMemo(
    () =>
      APPS.map((a, i) => ({ ...a, i })).filter((a) =>
        (a.name + " " + a.desc)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const counts = useMemo(
    () => ({
      all: APPS.length,
      platform: APPS.filter((a) => a.group === "platform").length,
      ai: APPS.filter((a) => a.group === "ai").length,
    }),
    []
  );

  const hoveredApp = activeApp !== null ? APPS[activeApp] : null;
  const activeService = SERVICES[shapeIndex] ?? SERVICES[0]!;

  return (
    <div
      dir={ar ? "rtl" : "ltr"}
      style={{
        fontFamily:
          '"Space Grotesk", "Cairo", ui-sans-serif, system-ui, sans-serif',
        fontSize: "17px",
      }}
      className="relative min-h-screen overflow-x-hidden bg-[#060609] text-[#f5f6fa] selection:bg-[#ff00ff] selection:text-black"
    >
      {/* FIXED RAY-MARCHED 3D CHROME LIQUID STAGE */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <ClientOnly fallback={null}>
          <Suspense fallback={null}>
            <DozfxStage
              shapeIndex={shapeIndex}
              scrollProgress={scrollProgress}
              flicker={flicker}
              activeIndex={activeApp}
            />
          </Suspense>
        </ClientOnly>
        {/* Subtle studio vignette & legibility veil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,transparent_18%,rgba(6,6,9,0.72)_78%,rgba(6,6,9,0.94)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#060609] via-[#060609]/60 to-transparent" />
      </div>

      {/* INTERACTIVE 12-COLUMN DESIGN SYSTEM GRID OVERLAY (Press 'G' on any page) */}
      {gridOpen && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-between"
        >
          <div className="mx-auto grid h-full w-full max-w-[1312px] grid-cols-4 gap-4 px-5 sm:grid-cols-8 md:grid-cols-12 md:gap-6 md:px-10">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className={`relative h-full border-x border-[#ff00ff]/25 bg-[#ff00ff]/[0.03] ${
                  idx >= 4 ? "hidden sm:block" : ""
                } ${idx >= 8 ? "sm:hidden md:block" : ""}`}
              >
                <span className="absolute top-20 left-1.5 font-mono text-[9px] tracking-[0.2em] text-[#ff00ff]/80">
                  {pad(idx + 1)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#ff00ff]/40 bg-[#060609]/90 px-6 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff00ff] backdrop-blur-md">
            <div className="mx-auto flex max-w-[1312px] flex-wrap items-center justify-between gap-2">
              <span>
                DOZFX TOKEN GRID OVERLAY · 12 COL DESKTOP / 8 TABLET / 4 MOBILE ·
                MAX 1312PX
              </span>
              <span>
                BASE: 17PX · SCALE: √φ (1.272) · PRESS [G] TO DISMISS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TOP SCROLL PROGRESS LINE */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/5">
        <div
          className="h-full origin-left bg-gradient-to-r from-white via-[#ff00ff] to-[#00f0ff] transition-transform duration-150"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* HEADER / NAVIGATION BAR */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#060609]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1312px] items-center justify-between gap-4 px-5 py-4 md:px-10">
          {/* Brand Logo */}
          <a
            href="#top"
            onClick={() => triggerShape(0)}
            aria-label="Environment Agency – Abu Dhabi"
            className="group flex items-center gap-3.5"
          >
            <img
              src="/edplogo.svg"
              alt="Environment Agency – Abu Dhabi"
              className="h-11 w-auto md:h-12"
            />
          </a>

          {/* Primary Nav Links */}
          <nav className="hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.24em] text-white/65 lg:flex">
            <a href="#services" className="transition hover:text-[#ff00ff]">
              Services
            </a>
            <a href="#work" className="transition hover:text-[#ff00ff]">
              Work
            </a>
            <a href="#index" className="transition hover:text-[#ff00ff]">
              24 Systems
            </a>
            <a href="#lab" className="transition hover:text-[#ff00ff]">
              Lab · Ink
            </a>
            <a href="#system" className="transition hover:text-[#ff00ff]">
              √φ System
            </a>
          </nav>

          {/* Right Controls: Edition Toggle, [G] Grid Toggle, Language, Start a Brief */}
          <div className="flex items-center gap-2.5">
            {/* Edition switcher */}
            <div className="hidden items-center border border-white/15 bg-white/[0.03] p-0.5 font-mono text-[10px] uppercase tracking-[0.2em] sm:flex">
              <button
                type="button"
                onClick={() => setEdition("hybrid")}
                className={`px-2.5 py-1 transition ${
                  edition === "hybrid"
                    ? "bg-white text-black font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                EAD × DOZFX
              </button>
              <button
                type="button"
                onClick={() => setEdition("dozfx")}
                className={`px-2.5 py-1 transition ${
                  edition === "dozfx"
                    ? "bg-[#ff00ff] text-black font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                DOZFX.COM
              </button>
            </div>

            {/* Interactive [G] Grid Overlay Toggle */}
            <button
              type="button"
              onClick={() => setGridOpen((v) => !v)}
              title="Toggle 12-column design grid (Shortcut: G)"
              className={`flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition ${
                gridOpen
                  ? "border-[#ff00ff] bg-[#ff00ff]/20 text-[#ff00ff] shadow-[0_0_20px_rgba(255,0,255,0.4)]"
                  : "border-white/15 text-white/65 hover:border-white/40 hover:text-white"
              }`}
            >
              <Grid className="h-3 w-3" />
              <span className="hidden md:inline">[G] Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setAr((v) => !v)}
              className="border border-white/15 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              {ar ? "EN" : "عربي"}
            </button>

            <button
              type="button"
              onClick={() => {
                setBriefSent(false);
                setBriefOpen(true);
              }}
              className="group relative inline-flex items-center gap-2 bg-[#ff00ff] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-black shadow-[0_0_28px_rgba(255,0,255,0.45)] transition hover:bg-white"
            >
              <span>Start a brief</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT (12-Column Tokenized Architecture) */}
      <main id="top" className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative flex min-h-screen flex-col justify-between pt-28 pb-12">
          <div className="mx-auto w-full max-w-[1312px] px-5 md:px-10">
            {/* Top Meta Telemetry Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-[#ff00ff] shadow-[0_0_12px_#ff00ff]" />
                <span>
                  {edition === "hybrid"
                    ? "LIQUID ENVIRONMENTAL INTELLIGENCE · ABU DHABI 24.4539°N 54.3773°E"
                    : "A LIQUID AGENCY · SILVER HOUSE, LIMASSOL, CYPRUS"}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span>RAY-MARCHED SDF: {activeService.shapeName}</span>
                <span className="hidden sm:inline text-[#ff00ff]">
                  ● #FF00FF STUDIO BOUNCE
                </span>
              </div>
            </div>

            {/* Hero 12-Col Grid */}
            <div className="mt-12 grid grid-cols-4 gap-6 sm:grid-cols-8 md:mt-20 md:grid-cols-12">
              <div className="col-span-4 sm:col-span-8 md:col-span-9">
                <div className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/75 backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-[#ff00ff]" />
                  <span>
                    {edition === "hybrid"
                      ? "Your Gateway to Environmental Insights · Liquid Edition"
                      : "dozfx Digital Creative Ltd · Creative Orchestration Layer"}
                  </span>
                </div>

                {/* Heavy, tight-set PolySans / Syne Bulky Headline */}
                <h1
                  style={{ fontFamily: '"Syne", sans-serif' }}
                  className="mt-6 text-[2.75rem] font-extrabold leading-[0.92] tracking-[-0.045em] text-white sm:text-[4.25rem] md:text-[5.6rem] lg:text-[6.4rem]"
                >
                  {edition === "hybrid" ? (
                    <>
                      <span className="block">A LIQUID PORTAL.</span>
                      <span className="block bg-gradient-to-r from-white via-white to-[#ff00ff] bg-clip-text text-transparent">
                        HUMAN INSIGHT.
                      </span>
                      <span className="block text-white/90">MACHINE SPEED.</span>
                    </>
                  ) : (
                    <>
                      <span className="block">A LIQUID AGENCY.</span>
                      <span className="block bg-gradient-to-r from-white via-white to-[#ff00ff] bg-clip-text text-transparent">
                        HUMAN TASTE.
                      </span>
                      <span className="block text-white/90">MACHINE SPEED.</span>
                    </>
                  )}
                </h1>

                <p className="mt-8 max-w-2xl text-[17px] leading-[1.6] text-white/70 md:text-[21.6px]">
                  {edition === "hybrid"
                    ? "Unlock environmental insights for a sustainable future. 09 core platforms and 15 satellite & underwater AI models rendered inside dozfx's tokenized √φ architecture and live ray-marched chrome stage."
                    : "Not a classic agency. Not a self-serve tool. A creative orchestration layer blending three decades of brand & product direction with hand-coded WebGL, live ray-marched 3D, and AI-accelerated speed."}
                </p>

                {/* Primary Hero Actions */}
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setBriefSent(false);
                      setBriefOpen(true);
                    }}
                    className="group inline-flex items-center gap-3 bg-white px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-[#ff00ff]"
                  >
                    <span>Start a brief</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>

                  <a
                    href="#index"
                    className="inline-flex items-center gap-3 border border-white/25 bg-black/40 px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-white backdrop-blur-md transition hover:border-[#ff00ff] hover:text-[#ff00ff]"
                  >
                    <span>Explore {APPS.length} Systems</span>
                    <span className="text-[#ff00ff]">↓</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setPaletteOpen(true)}
                    className="inline-flex items-center gap-2.5 border border-white/15 bg-white/[0.03] px-4 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 transition hover:border-white/40 hover:text-white"
                  >
                    <Search className="h-3.5 w-3.5 text-[#ff00ff]" />
                    <span>Quick Jump</span>
                    <span className="border border-white/20 px-1.5 py-0.5 text-[9px]">
                      ⌘K
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column Live Shader Telemetry Card */}
              <div className="col-span-4 flex flex-col justify-end sm:col-span-8 md:col-span-3">
                <div className="border border-white/15 bg-[#09090f]/75 p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                    <span>LIVE RAY-MARCHER</span>
                    <span className="text-[#ff00ff]">60 FPS GPU</span>
                  </div>
                  <div
                    style={{ fontFamily: '"Syne", sans-serif' }}
                    className="mt-3 text-xl font-bold tracking-tight text-white"
                  >
                    {edition === "hybrid"
                      ? activeService.edpTitle
                      : activeService.dozfxTitle}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                    {edition === "hybrid"
                      ? activeService.edpSub
                      : activeService.dozfxSub}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10px] uppercase tracking-[0.22em]">
                    <span className="text-white/45">
                      SHAPE {pad(shapeIndex + 1)} / 05
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        triggerShape((shapeIndex + 1) % 5, true)
                      }
                      className="text-[#ff00ff] underline-offset-4 hover:underline"
                    >
                      MORPH NOW →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Bottom Bar: Interactive 5-Shape Morph Switcher */}
          <div className="mx-auto mt-14 w-full max-w-[1312px] px-5 md:px-10">
            <div className="grid grid-cols-2 gap-2 border-t border-white/15 pt-5 sm:grid-cols-5">
              {SERVICES.map((s) => {
                const isCurrent = shapeIndex === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => triggerShape(s.id, true)}
                    onMouseEnter={() => triggerShape(s.id, false)}
                    className={`group text-left p-3 transition border ${
                      isCurrent
                        ? "border-[#ff00ff] bg-[#ff00ff]/10"
                        : "border-white/10 bg-black/35 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                      <span
                        className={
                          isCurrent ? "text-[#ff00ff]" : "text-white/40"
                        }
                      >
                        {s.code} · SHAPE
                      </span>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isCurrent ? "bg-[#ff00ff]" : "bg-white/20"
                        }`}
                      />
                    </div>
                    <div className="mt-2 text-xs font-semibold tracking-tight text-white">
                      {edition === "hybrid" ? s.edpTitle : s.dozfxTitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 01: SERVICES / LIQUID CAPABILITIES (Morphs 3D Chrome on Hover/Click) */}
        <section
          id="services"
          className="relative border-t border-white/12 bg-[#060609]/80 py-24 backdrop-blur-md md:py-32"
        >
          <div className="mx-auto max-w-[1312px] px-5 md:px-10">
            <div className="grid grid-cols-4 gap-6 sm:grid-cols-8 md:grid-cols-12">
              <div className="col-span-4 md:col-span-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff00ff]">
                  01 / CAPABILITIES &amp; SERVICE SHAPES
                </p>
                <h2
                  style={{ fontFamily: '"Syne", sans-serif' }}
                  className="mt-4 text-3xl font-extrabold leading-[0.98] tracking-[-0.035em] md:text-5xl"
                >
                  {edition === "hybrid"
                    ? "Five liquid pillars of environmental intelligence."
                    : "Out of chaos, structure."}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  Hover or select any discipline below to melt the live
                  ray-marched chrome form into its corresponding signed-distance
                  service geometry.
                </p>
              </div>

              <div className="col-span-4 sm:col-span-8 md:col-span-8">
                <div className="divide-y divide-white/12 border-y border-white/12">
                  {SERVICES.map((s) => {
                    const active = shapeIndex === s.id;
                    return (
                      <div
                        key={s.id}
                        onMouseEnter={() => triggerShape(s.id, false)}
                        onClick={() => triggerShape(s.id, true)}
                        className={`group cursor-pointer py-7 transition px-4 -mx-4 ${
                          active ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between">
                          <div className="flex items-baseline gap-5">
                            <span className="font-mono text-xs text-[#ff00ff]">
                              {s.code}
                            </span>
                            <div>
                              <h3
                                style={{ fontFamily: '"Syne", sans-serif' }}
                                className="text-2xl font-bold tracking-[-0.03em] text-white transition group-hover:text-[#ff00ff] md:text-3xl"
                              >
                                {edition === "hybrid"
                                  ? s.edpTitle
                                  : s.dozfxTitle}
                              </h3>
                              <p className="mt-1 font-mono text-xs text-white/55">
                                {edition === "hybrid" ? s.edpSub : s.dozfxSub}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                            SDF · {s.shapeName}
                          </span>
                        </div>

                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:ml-10">
                          {edition === "hybrid" ? s.edpDesc : s.dozfxDesc}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 md:ml-10">
                          {s.deliverables.map((d) => (
                            <span
                              key={d}
                              className="border border-white/12 bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: SELECTED WORK / CASE STUDIES */}
        <section
          id="work"
          className="relative border-t border-white/12 py-24 md:py-32"
        >
          <div className="mx-auto max-w-[1312px] px-5 md:px-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff00ff]">
                  02 / SELECTED WORK &amp; DEPLOYMENTS
                </p>
                <h2
                  style={{ fontFamily: '"Syne", sans-serif' }}
                  className="mt-3 text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-6xl"
                >
                  Engineered for impact.
                </h2>
              </div>
              <p className="max-w-md font-mono text-xs uppercase tracking-[0.22em] text-white/55">
                END-TO-END IDENTITIES, HIGH-SPEED WEB PRODUCTS, AND GEOSPATIAL
                AI INTERFACES.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-4 gap-6 sm:grid-cols-8 md:grid-cols-12">
              {SHOWCASE_CASES.map((c) => (
                <article
                  key={c.client}
                  onMouseEnter={() => triggerShape(c.shape, false)}
                  className="group col-span-4 flex flex-col justify-between border border-white/15 bg-[#09090f]/80 p-7 backdrop-blur-xl transition hover:border-[#ff00ff] sm:col-span-4 md:col-span-6"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.26em] text-white/50">
                      <span>{c.code}</span>
                      <span className="text-[#ff00ff]">{c.metric}</span>
                    </div>
                    <h3
                      style={{ fontFamily: '"Syne", sans-serif' }}
                      className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-white transition group-hover:text-[#ff00ff] md:text-3xl"
                    >
                      {c.client}
                    </h3>
                    <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                      {c.category} · {c.year}
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-white/70">
                      {c.summary}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.26em] text-white/60">
                    <span>INSPECT ARCHITECTURE</span>
                    <ArrowUpRight className="h-4 w-4 text-[#ff00ff] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 03: FULL 24-SYSTEM KINETIC INDEX (EAD Platforms & AI Models in dozfx Grid) */}
        <section
          id="index"
          className="relative border-t border-white/12 bg-[#060609]/85 py-24 backdrop-blur-lg md:py-32"
        >
          <div className="mx-auto max-w-[1312px] px-5 md:px-10">
            {/* Marquee ticker */}
            <div className="mb-14 overflow-hidden border-y border-white/12 py-3.5">
              <div className="marquee flex w-max gap-10 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.35em] text-white/55">
                {[...APPS, ...APPS].map((a, idx) => (
                  <span key={idx} className="flex items-center gap-10">
                    {a.name}
                    <span className="h-1.5 w-1.5 bg-[#ff00ff]" />
                  </span>
                ))}
              </div>
            </div>

            {/* Filter Counters + Search Trigger */}
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff00ff]">
                  03 / COMPLETE SYSTEM DIRECTORY · 12-COLUMN INDEX
                </p>
                <div className="mt-6 flex flex-wrap items-end gap-8 md:gap-12">
                  {(
                    [
                      ["all", "All Systems"],
                      ["platform", "Platforms"],
                      ["ai", "AI Models"],
                    ] as const
                  ).map(([key, label]) => {
                    const active = filter === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setFilter(key);
                          triggerShape(
                            key === "platform" ? 1 : key === "ai" ? 2 : 0,
                            false
                          );
                        }}
                        className="group text-left"
                      >
                        <div
                          style={{ fontFamily: '"Syne", sans-serif' }}
                          className={`text-5xl font-extrabold leading-none tabular-nums transition md:text-7xl ${
                            active
                              ? "text-white"
                              : "text-white/25 group-hover:text-white/60"
                          }`}
                        >
                          {pad(counts[key])}
                        </div>
                        <div
                          className={`mt-2 font-mono text-[10px] uppercase tracking-[0.28em] transition ${
                            active ? "text-[#ff00ff]" : "text-white/45"
                          }`}
                        >
                          {active ? "■ " : ""}
                          {label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="flex items-center gap-3 self-start border border-white/20 bg-white/[0.03] px-5 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-white/75 transition hover:border-[#ff00ff] hover:text-white md:self-auto"
              >
                <Search className="h-4 w-4 text-[#ff00ff]" />
                <span>Filter 24 systems</span>
                <span className="flex items-center gap-1 border border-white/20 px-1.5 py-0.5 text-[10px]">
                  <Command className="h-3 w-3" />K
                </span>
              </button>
            </div>

            {/* Kinetic List */}
            <ul
              className="mt-12 divide-y divide-white/12 border-y border-white/12"
              onMouseLeave={() => setActiveApp(null)}
            >
              {filteredApps.map((a) => {
                const dimmed = activeApp !== null && activeApp !== a.i;
                return (
                  <li key={a.name}>
                    <a
                      href={`#app-${a.i + 1}`}
                      onClick={(e) => {
                        e.preventDefault();
                        triggerShape((a.i % 4) + 1, true);
                      }}
                      onMouseEnter={() => {
                        setActiveApp(a.i);
                        setShapeIndex((a.i % 4) + 1);
                      }}
                      className={`group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 transition-all duration-300 md:grid-cols-[4rem_1fr_11rem_9rem_auto] md:py-6 ${
                        dimmed ? "opacity-30" : "opacity-100"
                      }`}
                    >
                      <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#ff00ff]/18 via-[#ff00ff]/5 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                      <span className="relative font-mono text-xs text-white/40 group-hover:text-[#ff00ff]">
                        {pad(a.i + 1)}
                      </span>
                      <span className="relative">
                        <span
                          style={{ fontFamily: '"Syne", sans-serif' }}
                          className="block text-xl font-bold tracking-[-0.025em] text-white transition-transform duration-300 group-hover:translate-x-3 md:text-3xl"
                        >
                          {a.name}
                        </span>
                        <span className="mt-1 block text-xs text-white/55 md:hidden">
                          {a.desc}
                        </span>
                      </span>
                      <span className="relative hidden font-mono text-[10px] uppercase tracking-[0.26em] text-white/45 md:block">
                        {a.lat.toFixed(2)}°N · {a.lon.toFixed(2)}°E
                      </span>
                      <span className="relative hidden font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff00ff] md:block">
                        {a.group === "ai" ? "AI · MODEL" : "PLATFORM"}
                      </span>
                      <span className="relative grid h-10 w-10 place-items-center border border-white/20 text-white transition duration-300 group-hover:rotate-45 group-hover:border-[#ff00ff] group-hover:bg-[#ff00ff] group-hover:text-black">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* SECTION 04: DOZFX LAB — "BRAND, SET IN INK" INTERACTIVE FLUID SIMULATION */}
        <section
          id="lab"
          className="relative border-t border-white/12 py-24 md:py-32"
        >
          <div className="mx-auto max-w-[1312px] px-5 md:px-10">
            <div className="grid grid-cols-4 gap-8 sm:grid-cols-8 md:grid-cols-12 md:items-center">
              <div className="col-span-4 md:col-span-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff00ff]">
                  04 / DOZFX LAB · INTERACTIVE PHYSICS
                </p>
                <h2
                  style={{ fontFamily: '"Syne", sans-serif' }}
                  className="mt-3 text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-5xl"
                >
                  Brand, set in ink.
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-white/70">
                  An interactive study from{" "}
                  <span className="text-white font-semibold">dozfx lab</span>:
                  thousands of digital ink particles suspended on dark water.
                  Drag your cursor across the tank to stir the fluid into chaos,
                  then press{" "}
                  <span className="text-[#ff00ff] font-mono">FORM</span> to
                  watch signed-distance attraction pull the mark back into
                  order.
                </p>
                <div className="mt-6 space-y-2 border-l-2 border-[#ff00ff] pl-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                  <div>● GPU-INSPIRED PARTICLE FIELD</div>
                  <div>● LIVE ORDER-MEASUREMENT METER</div>
                  <div>● SWITCH WORDMARKS: DOZFX / EAD · EDP / LIQUID</div>
                </div>
              </div>

              <div className="col-span-4 sm:col-span-8 md:col-span-7">
                <InkWaterLab
                  word={edition === "hybrid" ? "EAD · EDP" : "DOZFX"}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 05: THE DESIGN SYSTEM (√φ Mathematical Scale & Studio Lighting Spec) */}
        <section
          id="system"
          className="relative border-t border-white/12 bg-[#060609]/90 py-24 backdrop-blur-xl md:py-32"
        >
          <div className="mx-auto max-w-[1312px] px-5 md:px-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff00ff]">
                  05 / MATHEMATICAL DESIGN SYSTEM
                </p>
                <h2
                  style={{ fontFamily: '"Syne", sans-serif' }}
                  className="mt-3 text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-6xl"
                >
                  Nothing placed by eye.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setGridOpen((v) => !v)}
                className="self-start border border-[#ff00ff] bg-[#ff00ff]/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-[#ff00ff] transition hover:bg-[#ff00ff] hover:text-black md:self-auto"
              >
                {gridOpen ? "Hide [G] 12-Col Grid" : "Inspect [G] 12-Col Grid"}
              </button>
            </div>

            <div className="mt-14 grid grid-cols-4 gap-6 sm:grid-cols-8 md:grid-cols-12">
              {/* Left: √φ Typography Scale Table */}
              <div className="col-span-4 border border-white/15 bg-[#09090f] p-6 sm:col-span-8 md:col-span-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">
                  <span>TYPOGRAPHIC SCALE · √φ = 1.2720196</span>
                  <span className="text-[#ff00ff]">BASE 17.0PX</span>
                </div>
                <div className="divide-y divide-white/10">
                  {TYPE_SCALE.map((row) => (
                    <div
                      key={row.step}
                      className="grid grid-cols-[4rem_6.5rem_4.5rem_1fr] items-center gap-3 py-3 font-mono text-xs"
                    >
                      <span className="text-[#ff00ff]">{row.step}</span>
                      <span className="text-white/55">{row.ratio}</span>
                      <span className="text-white font-semibold">{row.px}</span>
                      <span className="truncate font-sans text-xs text-white/70">
                        {row.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Studio Lighting & Performance Budget */}
              <div className="col-span-4 flex flex-col justify-between gap-6 sm:col-span-8 md:col-span-5">
                <div className="border border-white/15 bg-[#09090f] p-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff00ff]">
                    RAY-MARCHED STUDIO LIGHTING RIG
                  </div>
                  <h3
                    style={{ fontFamily: '"Syne", sans-serif' }}
                    className="mt-3 text-2xl font-bold text-white"
                  >
                    Three-point chrome reflection
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-white/70">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 bg-white" />
                      <span>
                        <strong className="text-white">Top-Left Softbox:</strong>{" "}
                        High-key studio specular gradient across upper chrome
                        curvature.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 bg-[#00f0ff]" />
                      <span>
                        <strong className="text-white">Right Strip Light:</strong>{" "}
                        Razor-sharp vertical specular rim defining silhouette
                        edges.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />
                      <span>
                        <strong className="text-white">
                          Bottom #FF00FF Bounce:
                        </strong>{" "}
                        Signature neon magenta floor bounce + transition flicker.
                      </span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => triggerShape((shapeIndex + 1) % 5, true)}
                    className="mt-6 w-full border border-white/20 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white transition hover:border-[#ff00ff] hover:text-[#ff00ff]"
                  >
                    Trigger #FF00FF Flicker &amp; Shape Melt
                  </button>
                </div>

                <div className="border border-white/15 bg-[#09090f] p-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
                    STUDIO &amp; ARCHITECTURAL FOOTPRINT
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 font-mono">
                    <div>
                      <div
                        style={{ fontFamily: '"Syne", sans-serif' }}
                        className="text-3xl font-extrabold text-white"
                      >
                        12
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        Desktop Cols
                      </div>
                    </div>
                    <div>
                      <div
                        style={{ fontFamily: '"Syne", sans-serif' }}
                        className="text-3xl font-extrabold text-[#ff00ff]"
                      >
                        1.272
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        √φ Scale
                      </div>
                    </div>
                    <div>
                      <div
                        style={{ fontFamily: '"Syne", sans-serif' }}
                        className="text-3xl font-extrabold text-white"
                      >
                        12h
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        Brief Reply
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER: START A BRIEF */}
        <section className="relative border-t border-white/12 py-24 md:py-32">
          <div className="mx-auto max-w-[1312px] px-5 text-center md:px-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#ff00ff]">
              HUMAN TASTE · MACHINE SPEED · REAL RESPONSE IN 12 HOURS
            </p>
            <h2
              style={{ fontFamily: '"Syne", sans-serif' }}
              className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold leading-[0.94] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl"
            >
              Ready to shape what comes next?
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setBriefSent(false);
                  setBriefOpen(true);
                }}
                className="inline-flex items-center gap-3 bg-[#ff00ff] px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-black shadow-[0_0_35px_rgba(255,0,255,0.5)] transition hover:bg-white"
              >
                <span>Start a brief</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <a
                href="mailto:hello@dozfx.com"
                className="border border-white/20 bg-black/50 px-8 py-4 font-mono text-xs uppercase tracking-[0.28em] text-white transition hover:border-white"
              >
                hello@dozfx.com
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/12 bg-[#050508] px-5 py-12 md:px-10">
        <div className="mx-auto flex max-w-[1312px] flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <img
              src="/edplogo.svg"
              alt="Environment Agency – Abu Dhabi"
              className="h-11 w-auto"
            />
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-white">
                Environment Agency – Abu Dhabi · EDP
              </div>
              <div className="mt-1 font-mono text-[11px] text-white/45">
                Silver House, Spyrou Kyprianou Ave 19, 3070 Limassol, Cyprus ·
                Abu Dhabi EDP
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.24em] text-white/55">
            <a href="/" className="transition hover:text-white">
              Home 1 (Three.js)
            </a>
            <a href="/home2" className="transition hover:text-white">
              Home 2 (Cesium)
            </a>
            <button
              type="button"
              onClick={() => setGridOpen((v) => !v)}
              className="transition hover:text-[#ff00ff]"
            >
              [G] Grid Overlay
            </button>
            <span className="text-white/35">© 2025 ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </footer>

      {/* FLOATING CURSOR PREVIEW CARD FOR THE 24 SYSTEMS */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
      >
        <div
          className={`w-72 border border-[#ff00ff]/60 bg-[#08080e]/95 p-5 shadow-[0_25px_70px_-15px_rgba(255,0,255,0.45)] backdrop-blur-2xl transition-all duration-200 ${
            hoveredApp ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[10px] uppercase tracking-[0.25em]">
            <span className="text-[#ff00ff]">
              {hoveredApp?.group === "ai" ? "AI · MODEL" : "PLATFORM"} /{" "}
              {activeApp !== null ? pad(activeApp + 1) : ""}
            </span>
            <span className="text-white/45">
              {hoveredApp
                ? `${hoveredApp.lat.toFixed(2)}°N ${hoveredApp.lon.toFixed(2)}°E`
                : ""}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center border border-[#ff00ff]/50 bg-[#ff00ff]/15 text-[#ff00ff]">
              {hoveredApp && (
                <AppIcon name={hoveredApp.icon} className="h-5 w-5" />
              )}
            </div>
            <div
              style={{ fontFamily: '"Syne", sans-serif' }}
              className="text-lg font-bold leading-tight text-white"
            >
              {hoveredApp?.name}
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/65">
            {hoveredApp?.desc}
          </p>
        </div>
      </div>

      {/* COMMAND PALETTE (⌘K) */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-start bg-black/75 px-4 pt-[14vh] backdrop-blur-md"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="mx-auto w-full max-w-xl border border-[#ff00ff]/50 bg-[#09090f] shadow-[0_0_60px_rgba(255,0,255,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/12 px-5 py-4">
              <Search className="h-4 w-4 text-[#ff00ff]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 24 EAD platforms, AI models, or services…"
                className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/35"
              />
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                aria-label="Close search"
              >
                <X className="h-4 w-4 text-white/50 hover:text-white" />
              </button>
            </div>
            <div className="max-h-[50vh] divide-y divide-white/5 overflow-y-auto p-2">
              {searchResults.map((a) => (
                <a
                  key={a.name}
                  href="#index"
                  onClick={() => {
                    setActiveApp(a.i);
                    triggerShape((a.i % 4) + 1, true);
                    setPaletteOpen(false);
                  }}
                  className="flex items-center gap-4 px-3 py-3 transition hover:bg-white/[0.05]"
                >
                  <span className="grid h-9 w-9 place-items-center border border-white/15 text-[#ff00ff]">
                    <AppIcon name={a.icon} className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-white">
                      {a.name}
                    </span>
                    <span className="line-clamp-1 text-xs text-white/50">
                      {a.desc}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ff00ff]">
                    {a.group === "ai" ? "AI" : "PLATFORM"}
                  </span>
                </a>
              ))}
              {searchResults.length === 0 && (
                <p className="p-6 text-center font-mono text-xs uppercase tracking-[0.25em] text-white/45">
                  No matching systems found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* "START A BRIEF" MODAL (dozfx 12-hour human response flow) */}
      {briefOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setBriefOpen(false)}
        >
          <div
            className="w-full max-w-lg border border-[#ff00ff] bg-[#08080d] p-7 shadow-[0_0_70px_rgba(255,0,255,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/12 pb-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff00ff]">
                  START A BRIEF · DOZFX STUDIO
                </div>
                <h3
                  style={{ fontFamily: '"Syne", sans-serif' }}
                  className="mt-1 text-2xl font-extrabold text-white"
                >
                  Human taste. 12-hour reply.
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBriefOpen(false)}
                aria-label="Close brief modal"
              >
                <X className="h-5 w-5 text-white/60 hover:text-white" />
              </button>
            </div>

            {briefSent ? (
              <div className="py-10 text-center">
                <div className="mx-auto inline-block border border-[#ff00ff] bg-[#ff00ff]/15 px-3 py-1 font-mono text-xs uppercase tracking-[0.28em] text-[#ff00ff]">
                  BRIEF DISPATCHED
                </div>
                <p className="mt-4 text-sm text-white/75">
                  A real person (never an automated bot) will review your brief
                  and respond within 12 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setBriefOpen(false)}
                  className="mt-6 bg-white px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-black"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBriefSent(true);
                  triggerShape(4, true);
                }}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
                    Your Name &amp; Organization
                  </label>
                  <input
                    required
                    placeholder="e.g., Layla Al Nahyan · EAD"
                    className="mt-1.5 w-full border border-white/20 bg-black/50 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#ff00ff]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="you@organization.ae"
                    className="mt-1.5 w-full border border-white/20 bg-black/50 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#ff00ff]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
                    What are we building?
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Brand identity, WebGL product, environmental AI portal, or creative retainer…"
                    className="mt-1.5 w-full border border-white/20 bg-black/50 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#ff00ff]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#ff00ff] py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:bg-white"
                >
                  Transmit Brief →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FLOATING ASSISTANT CHAT */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-80 border border-[#ff00ff]/60 bg-[#08080e]/95 shadow-[0_0_45px_rgba(255,0,255,0.3)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/12 px-4 py-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-white">
                EAD × DOZFX Assistant
              </span>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4 text-white/60 hover:text-white" />
              </button>
            </div>
            <div className="p-4">
              <div className="border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs leading-relaxed text-white/80">
                Hi! Press <span className="text-[#ff00ff] font-mono">G</span> to
                inspect the 12-column token grid, or ask me about any of the 24
                environmental platforms and AI models.
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-white/12 px-3 py-2.5">
              <input
                placeholder="Type a message…"
                className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/40"
              />
              <Send className="h-3.5 w-3.5 text-[#ff00ff]" />
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setChatOpen((v) => !v)}
          className="grid h-13 w-13 place-items-center border border-[#ff00ff] bg-[#08080e]/90 text-[#ff00ff] shadow-[0_0_25px_rgba(255,0,255,0.4)] transition hover:bg-[#ff00ff] hover:text-black"
          aria-label="Chat"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
