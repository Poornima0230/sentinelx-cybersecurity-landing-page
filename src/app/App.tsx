import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ThreatLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface ThreatEvent {
  id: string;
  origin: string;
  target: string;
  type: string;
  level: ThreatLevel;
  time: string;
  blocked: boolean;
}

interface TimelineEntry {
  year: string;
  event: string;
  detail: string;
  scale: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const THREAT_FEED: ThreatEvent[] = [
  { id: "EVT-9912", origin: "45.33.32.156", target: "api.corp.internal", type: "SQL INJECTION", level: "CRITICAL", time: "00:00:01", blocked: true },
  { id: "EVT-9911", origin: "185.220.101.9", target: "auth.corp.internal", type: "BRUTE FORCE", level: "HIGH", time: "00:00:04", blocked: true },
  { id: "EVT-9910", origin: "162.247.72.8", target: "cdn-01.corp.net", type: "DDoS FLOOD", level: "CRITICAL", time: "00:00:07", blocked: true },
  { id: "EVT-9909", origin: "93.115.0.30", target: "mail.corp.internal", type: "PHISHING", level: "MEDIUM", time: "00:00:11", blocked: true },
  { id: "EVT-9908", origin: "104.21.94.11", target: "vpn.corp.internal", type: "ZERO-DAY EXPLOIT", level: "CRITICAL", time: "00:00:15", blocked: true },
  { id: "EVT-9907", origin: "198.54.117.3", target: "db-replica-02", type: "DATA EXFIL", level: "HIGH", time: "00:00:18", blocked: true },
  { id: "EVT-9906", origin: "217.138.222.4", target: "k8s-ingress-01", type: "CONTAINER ESCAPE", level: "HIGH", time: "00:00:22", blocked: true },
  { id: "EVT-9905", origin: "51.15.112.89", target: "s3://prod-backups", type: "RANSOMWARE", level: "CRITICAL", time: "00:00:26", blocked: true },
];

const TIMELINE: TimelineEntry[] = [
  { year: "2019", event: "SolarWinds Supply Chain", detail: "18,000 organizations compromised via trojanized software update.", scale: "$40B global damage" },
  { year: "2020", event: "Colonial Pipeline Shutdown", detail: "Critical US fuel infrastructure forced offline for six days.", scale: "$4.4M ransom paid" },
  { year: "2021", event: "Log4Shell Zero-Day", detail: "Remote code execution in billions of Java applications worldwide.", scale: "CVSS score 10.0" },
  { year: "2022", event: "Lapsus$ State Actor", detail: "Microsoft, Okta, Samsung breached through social engineering.", scale: "Nation-state level" },
  { year: "2023", event: "MOVEit Mass Exploitation", detail: "2,600+ organizations exfiltrated via single SQL injection flaw.", scale: "90M records stolen" },
  { year: "2024", event: "AI-Augmented Attacks", detail: "Adversarial ML used to bypass detection at scale for first time.", scale: "400% increase YoY" },
];

const STATS = [
  { value: "< 47ms", label: "Mean Detection Time", sub: "industry avg: 287 days" },
  { value: "100%", label: "Threat Neutralization", sub: "zero breaches in 6 years" },
  { value: "2.3B+", label: "Events / Day Analyzed", sub: "across all client surfaces" },
  { value: "FIPS 140-3", label: "Cryptographic Standard", sub: "NSA Suite B compliant" },
];

const NAV_LINKS = ["Operations", "Intelligence", "Compliance", "Operators", "Contact"];

const THREAT_COLORS: Record<ThreatLevel, string> = {
  CRITICAL: "#ff2d55",
  HIGH: "#ff6b1a",
  MEDIUM: "#ffd60a",
  LOW: "#34c759",
};

// ─── Utility components ───────────────────────────────────────────────────────

function MonoLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`text-[10px] tracking-[0.22em] uppercase ${className}`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <MonoLabel className="text-cyan-500/40">{index}</MonoLabel>
      <div className="h-px flex-1 max-w-[40px] bg-cyan-500/20" />
      <MonoLabel className="text-cyan-400/60">{label}</MonoLabel>
      <div className="h-px flex-1 bg-cyan-500/10" />
    </div>
  );
}

function StatusDot({ pulse = false, color = "#00c8ff" }: { pulse?: boolean; color?: string }) {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {pulse && (
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
    </span>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-cyan-500/10" />
      <div className="w-1 h-1 bg-cyan-500/20 rotate-45" />
      <div className="h-px flex-1 bg-cyan-500/10" />
    </div>
  );
}

// ─── Grid / Overlay ───────────────────────────────────────────────────────────

function GridOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 h-full w-full opacity-[0.032]">
        <defs>
          <pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#00c8ff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function MissionClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <MonoLabel className="text-cyan-400/50">
      {p(t.getUTCHours())}:{p(t.getUTCMinutes())}:{p(t.getUTCSeconds())} UTC
    </MonoLabel>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 h-13 transition-all duration-300"
      style={{
        height: "52px",
        borderBottom: scrolled ? "1px solid rgba(0,200,255,0.1)" : "1px solid transparent",
        background: scrolled ? "rgba(3,11,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative w-6 h-6 shrink-0">
          <div className="absolute inset-0 border border-cyan-400/50 rotate-45" />
          <div className="absolute inset-[4px] bg-cyan-400/90" />
        </div>
        <MonoLabel className="text-cyan-100 text-[11px]">SENTINEL · DEFENSE</MonoLabel>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((l) => (
          <button key={l} className="group flex flex-col gap-0.5 cursor-pointer">
            <MonoLabel className="text-cyan-300/40 group-hover:text-cyan-300/80 transition-colors">{l}</MonoLabel>
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <MissionClock />
        <div className="hidden sm:flex items-center gap-1.5">
          <StatusDot pulse color="#ff2d55" />
          <MonoLabel className="text-red-400/60">LIVE THREAT FEED</MonoLabel>
        </div>
      </div>
    </nav>
  );
}

// ─── Section 01: Hero ─────────────────────────────────────────────────────────

function RadarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;
    let raf: number;

    const blips: { x: number; y: number; age: number }[] = [];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w <= 0 || h <= 0) { raf = requestAnimationFrame(draw); return; }
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.max(1, Math.min(w, h) / 2 - 2);

      ctx.clearRect(0, 0, w, h);

      // Rings
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (r * i) / 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,200,255,${0.03 + i * 0.008})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Cross
      ctx.strokeStyle = "rgba(0,200,255,0.05)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
      ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
      ctx.stroke();

      // Diagonal cross
      const d = r * 0.707;
      ctx.strokeStyle = "rgba(0,200,255,0.03)";
      ctx.beginPath();
      ctx.moveTo(cx - d, cy - d); ctx.lineTo(cx + d, cy + d);
      ctx.moveTo(cx + d, cy - d); ctx.lineTo(cx - d, cy + d);
      ctx.stroke();

      // Sweep
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const grad = ctx.createLinearGradient(0, 0, r, 0);
      grad.addColorStop(0, "rgba(0,200,255,0.2)");
      grad.addColorStop(1, "rgba(0,200,255,0)");
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, -Math.PI / 6, 0);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r, 0);
      ctx.strokeStyle = "rgba(0,200,255,0.55)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Spawn blip
      if (Math.random() < 0.03) {
        const a = angle - 0.05 + Math.random() * 0.1;
        const dist = (0.3 + Math.random() * 0.6) * r;
        blips.push({ x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist, age: 0 });
      }

      // Draw blips
      for (const b of blips) {
        const alpha = Math.max(0, 1 - b.age / 120);
        const isRed = Math.random() < 0.0005;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isRed ? `rgba(255,45,85,${alpha})` : `rgba(0,200,255,${alpha})`;
        ctx.fill();
        b.age++;
      }

      // Cull old blips
      for (let i = blips.length - 1; i >= 0; i--) {
        if (blips[i].age > 120) blips.splice(i, 1);
      }

      angle += 0.007;
      raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w > 0) canvas.width = w;
      if (h > 0) canvas.height = h;
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="block w-full h-full" />;
}

function HeroSection() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 47 + 3)), 80);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-14 pt-24 pb-16">
      {/* Top classification bar */}
      <div className="absolute top-[52px] left-0 right-0 flex items-center justify-between px-8 md:px-14 py-1.5"
        style={{ background: "rgba(255,45,85,0.06)", borderBottom: "1px solid rgba(255,45,85,0.12)" }}>
        <MonoLabel className="text-red-400/60">CLASSIFICATION: CONFIDENTIAL // SENTINEL-7 NETWORK</MonoLabel>
        <MonoLabel className="text-red-400/40">AUTHORIZED PERSONNEL ONLY</MonoLabel>
      </div>

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center">
        {/* Left */}
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-cyan-400/40" />
            <MonoLabel className="text-cyan-500/50">THREAT INTELLIGENCE PLATFORM · GENERATION VII</MonoLabel>
          </div>

          {/* Headline */}
          <h1
            className="leading-[0.88] font-black tracking-tight mb-0"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
            }}
          >
            <span className="block text-cyan-50">YOUR PERIMETER</span>
            <span
              className="block"
              style={{
                WebkitTextStroke: "1px rgba(0,200,255,0.3)",
                color: "transparent",
              }}
            >
              IS NOT
            </span>
            <span className="block text-cyan-400">A LINE.</span>
          </h1>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-cyan-500/15" />
            <div className="w-1.5 h-1.5 bg-cyan-500/30 rotate-45" />
            <div className="h-px w-10 bg-cyan-500/10" />
          </div>

          <p
            className="text-[1.05rem] leading-[1.8] max-w-[520px] mb-10"
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 300,
              color: "rgba(200,223,245,0.5)",
            }}
          >
            Modern adversaries operate across every layer of your stack simultaneously.
            Sentinel continuously maps, monitors, and neutralizes threats in real time —
            before your team knows an incident was attempted.
          </p>

          {/* Live counter */}
          <div className="flex items-baseline gap-3 mb-10">
            <span
              className="text-4xl font-bold tabular-nums text-cyan-300"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {count.toLocaleString()}
            </span>
            <MonoLabel className="text-cyan-500/50">threats neutralized this session</MonoLabel>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <button
              className="px-8 py-3.5 transition-all duration-200"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#030b14",
                background: "#00c8ff",
                border: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#33d4ff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#00c8ff")}
            >
              Request Clearance
            </button>
            <button
              className="px-8 py-3.5 transition-all duration-200"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(200,223,245,0.45)",
                background: "transparent",
                border: "1px solid rgba(0,200,255,0.15)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,200,255,0.35)"; e.currentTarget.style.color = "rgba(200,223,245,0.75)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,200,255,0.15)"; e.currentTarget.style.color = "rgba(200,223,245,0.45)"; }}
            >
              View Intelligence Brief →
            </button>
          </div>
        </div>

        {/* Right: Radar */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-3">
            <MonoLabel className="text-cyan-500/40">THREAT SWEEP · SECTOR 7</MonoLabel>
            <div className="flex items-center gap-2">
              <StatusDot pulse color="#ff2d55" />
              <MonoLabel className="text-red-400/50">ACTIVE</MonoLabel>
            </div>
          </div>
          <div
            className="relative overflow-hidden"
            style={{ border: "1px solid rgba(0,200,255,0.1)", aspectRatio: "1" }}
          >
            <RadarCanvas />
            <div className="absolute inset-3 pointer-events-none">
              <div className="absolute top-0 left-0 w-4 h-px bg-cyan-400/30" />
              <div className="absolute top-0 left-0 h-4 w-px bg-cyan-400/30" />
              <div className="absolute top-0 right-0 w-4 h-px bg-cyan-400/30" />
              <div className="absolute top-0 right-0 h-4 w-px bg-cyan-400/30" />
              <div className="absolute bottom-0 left-0 w-4 h-px bg-cyan-400/30" />
              <div className="absolute bottom-0 left-0 h-4 w-px bg-cyan-400/30" />
              <div className="absolute bottom-0 right-0 w-4 h-px bg-cyan-400/30" />
              <div className="absolute bottom-0 right-0 h-4 w-px bg-cyan-400/30" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <MonoLabel className="text-cyan-600/30">RANGE: 0–500km</MonoLabel>
            <MonoLabel className="text-cyan-600/30">2.847 ENTITIES TRACKED</MonoLabel>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-10 bg-cyan-400" style={{ animation: "scaleY 1.8s ease-in-out infinite", transformOrigin: "top" }} />
        <MonoLabel className="text-cyan-400">SCROLL</MonoLabel>
      </div>
    </section>
  );
}

// ─── Section 02: Live Threat Feed ─────────────────────────────────────────────

function ThreatFeedSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative px-8 md:px-14 py-24">
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel index="02" label="Real-Time Threat Intelligence" />

        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold leading-tight text-cyan-50"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Every attack is logged,<br />classified, and stopped.
          </h2>
          <p
            className="text-sm leading-relaxed self-end"
            style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, color: "rgba(200,223,245,0.45)" }}
          >
            The feed below represents actual threat events intercepted across our
            client network in the past 30 seconds. No simulation. No staging data.
          </p>
        </div>

        {/* Column headers */}
        <div
          className="grid gap-4 pb-3 mb-0"
          style={{
            gridTemplateColumns: "90px 140px 180px 1fr 110px 80px 80px",
            borderBottom: "1px solid rgba(0,200,255,0.12)",
          }}
        >
          {["EVENT ID", "ORIGIN IP", "TARGET", "ATTACK TYPE", "SEVERITY", "TIME", "STATUS"].map((h) => (
            <MonoLabel key={h} className="text-cyan-500/35">{h}</MonoLabel>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y" style={{ borderColor: "rgba(0,200,255,0.06)" }}>
          {THREAT_FEED.map((evt, i) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="grid gap-4 py-3 group hover:bg-cyan-500/[0.025] transition-colors cursor-default"
              style={{ gridTemplateColumns: "90px 140px 180px 1fr 110px 80px 80px" }}
            >
              <MonoLabel className="text-cyan-500/40">{evt.id}</MonoLabel>
              <MonoLabel className="text-cyan-200/60">{evt.origin}</MonoLabel>
              <MonoLabel className="text-cyan-200/50">{evt.target}</MonoLabel>
              <MonoLabel className="text-cyan-100/80">{evt.type}</MonoLabel>
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: THREAT_COLORS[evt.level] }}
                />
                <MonoLabel style={{ color: THREAT_COLORS[evt.level] + "cc" }}>{evt.level}</MonoLabel>
              </div>
              <MonoLabel className="text-cyan-500/40">{evt.time}</MonoLabel>
              <MonoLabel className="text-emerald-400/70">BLOCKED</MonoLabel>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,200,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <StatusDot pulse color="#ff2d55" />
            <MonoLabel className="text-cyan-500/35">Live · updating every 3s · global sensor network</MonoLabel>
          </div>
          <MonoLabel className="text-cyan-500/25">SENTINEL-GRID v7.4.1</MonoLabel>
        </div>
      </div>
    </section>
  );
}

// ─── Section 03: Stats ────────────────────────────────────────────────────────

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative px-8 md:px-14 py-24" style={{ borderTop: "1px solid rgba(0,200,255,0.07)", borderBottom: "1px solid rgba(0,200,255,0.07)" }}>
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,200,255,0.022) 0%, transparent 70%)" }}
      />

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x"
          style={{ borderColor: "rgba(0,200,255,0.08)" }}>
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col gap-2 px-8 py-10 first:pl-0"
            >
              <div
                className="text-3xl md:text-4xl font-bold leading-none text-cyan-300 mb-1"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {s.value}
              </div>
              <MonoLabel className="text-cyan-100/70">{s.label}</MonoLabel>
              <MonoLabel className="text-cyan-500/35">{s.sub}</MonoLabel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 04: Threat Timeline ──────────────────────────────────────────────

function TimelineSection() {
  const [active, setActive] = useState(5);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative px-8 md:px-14 py-24">
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel index="04" label="The Threat Landscape — 2019–2024" />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold leading-tight text-cyan-50"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            The attacks that<br />rewrote the rules.
          </h2>
          <p
            className="text-sm leading-relaxed self-end"
            style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, color: "rgba(200,223,245,0.4)" }}
          >
            Each incident below reshaped how organizations think about security.
            Sentinel was built by the analysts who responded to them.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Spine */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(0,200,255,0.25) 10%, rgba(0,200,255,0.25) 90%, transparent)" }}
          />

          <div className="flex flex-col">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="relative pl-10 pb-0 group cursor-pointer"
                onClick={() => setActive(i)}
              >
                {/* Node */}
                <div
                  className="absolute left-0 top-4 -translate-x-1/2 transition-all duration-200"
                  style={{
                    width: active === i ? "10px" : "6px",
                    height: active === i ? "10px" : "6px",
                    background: active === i ? "#ff2d55" : "rgba(0,200,255,0.3)",
                    transform: "translateX(-50%) rotate(45deg)",
                  }}
                />

                <div
                  className="flex flex-col sm:flex-row sm:items-start gap-4 py-5 transition-all duration-200"
                  style={{ borderBottom: "1px solid rgba(0,200,255,0.06)" }}
                >
                  <MonoLabel className="text-cyan-500/40 shrink-0 w-12">{item.year}</MonoLabel>
                  <div className="flex-1">
                    <div
                      className="text-base font-semibold text-cyan-100 mb-1 transition-colors"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: active === i ? "#00c8ff" : "rgba(200,223,245,0.85)",
                        fontSize: "13px",
                      }}
                    >
                      {item.event}
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        fontFamily: "'Geist', sans-serif",
                        fontWeight: 300,
                        color: active === i ? "rgba(200,223,245,0.6)" : "rgba(200,223,245,0.3)",
                        transition: "color 0.2s",
                      }}
                    >
                      {item.detail}
                    </p>
                  </div>
                  <MonoLabel
                    className="shrink-0"
                    style={{ color: active === i ? "#ff6b1a" : "rgba(200,223,245,0.2)" }}
                  >
                    {item.scale}
                  </MonoLabel>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 05: Architecture ──────────────────────────────────────────────────

function ArchSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const layers = [
    { label: "PERIMETER INTELLIGENCE", width: "100%", color: "rgba(0,200,255,0.12)", border: "rgba(0,200,255,0.2)", items: ["BGP Monitoring", "DDoS Scrubbing", "DNS Sinkholing", "GeoIP Filtering"] },
    { label: "NETWORK FABRIC", width: "85%", color: "rgba(0,200,255,0.08)", border: "rgba(0,200,255,0.15)", items: ["Zero Trust NAC", "East-West Traffic", "Encrypted Tunnels", "SD-WAN Policy"] },
    { label: "ENDPOINT & IDENTITY", width: "70%", color: "rgba(0,200,255,0.06)", border: "rgba(0,200,255,0.12)", items: ["EDR / XDR Agent", "MFA Enforcement", "Privilege Escalation Watch", "Device Attestation"] },
    { label: "APPLICATION LAYER", width: "55%", color: "rgba(255,107,26,0.05)", border: "rgba(255,107,26,0.15)", items: ["WAF Rules", "API Rate Limiting", "SAST/DAST Integration", "Container Security"] },
    { label: "DATA CORE", width: "40%", color: "rgba(255,45,85,0.05)", border: "rgba(255,45,85,0.2)", items: ["FIPS 140-3 Encryption", "DLP Policies", "Immutable Audit Log", "Sovereign Key Mgmt"] },
  ];

  return (
    <section ref={ref} className="relative px-8 md:px-14 py-24" style={{ borderTop: "1px solid rgba(0,200,255,0.07)" }}>
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel index="05" label="Defense Architecture" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 mb-16">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold leading-tight text-cyan-50 mb-6"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Defense<br />in depth.
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, color: "rgba(200,223,245,0.4)" }}
            >
              Sentinel operates across five concentric layers. An adversary who
              defeats one layer finds a harder one waiting. There is no single
              point of failure.
            </p>
          </div>

          {/* Concentric layer visualization */}
          <div className="flex flex-col gap-3">
            {layers.map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleX: 0.7 }}
                animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                style={{ width: layer.width, transformOrigin: "left" }}
              >
                <div
                  className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
                  style={{ background: layer.color, border: `1px solid ${layer.border}` }}
                >
                  <MonoLabel className="text-cyan-300/60 shrink-0 w-44">{layer.label}</MonoLabel>
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {layer.items.map((item) => (
                      <MonoLabel key={item} className="text-cyan-500/35">{item}</MonoLabel>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 06: Compliance ────────────────────────────────────────────────────

function ComplianceSection() {
  const certs = [
    { id: "SOC2-T2", label: "SOC 2 Type II", detail: "Annual third-party audit" },
    { id: "ISO-27001", label: "ISO 27001:2022", detail: "Information security mgmt" },
    { id: "FIPS-140-3", label: "FIPS 140-3", detail: "Cryptographic module validation" },
    { id: "FedRAMP-H", label: "FedRAMP High", detail: "Federal authorization" },
    { id: "CMMC-3", label: "CMMC Level 3", detail: "Defense contractor certified" },
    { id: "GDPR", label: "GDPR / CCPA", detail: "Data residency guarantees" },
  ];

  return (
    <section
      className="relative px-8 md:px-14 py-24"
      style={{ borderTop: "1px solid rgba(0,200,255,0.07)", borderBottom: "1px solid rgba(0,200,255,0.07)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 100% at 100% 50%, rgba(0,200,255,0.018) 0%, transparent 70%)" }}
      />

      <div className="max-w-[1400px] mx-auto">
        <SectionLabel index="06" label="Certifications & Compliance" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold leading-tight text-cyan-50 mb-6"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Audited.<br />Certified.<br />Accountable.
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, color: "rgba(200,223,245,0.4)" }}
            >
              Trust is earned through external verification, not self-attestation.
              Every Sentinel certification is maintained by independent third-party
              auditors with full scope access.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y"
            style={{ borderColor: "rgba(0,200,255,0.07)" }}>
            {certs.map((cert, i) => (
              <div
                key={i}
                className="flex items-center gap-5 py-5 group hover:bg-cyan-500/[0.02] transition-colors cursor-default"
                style={{ borderLeft: i % 2 === 1 ? "1px solid rgba(0,200,255,0.07)" : "none", paddingLeft: i % 2 === 1 ? "24px" : "0" }}
              >
                <div className="flex items-center justify-center w-8 h-8 shrink-0 border border-emerald-400/25 rotate-45">
                  <div className="w-2 h-2 bg-emerald-400/60 rotate-[-45deg]" />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold text-cyan-100/80 mb-0.5"
                    style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "11px" }}
                  >
                    {cert.label}
                  </div>
                  <MonoLabel className="text-cyan-500/35">{cert.detail}</MonoLabel>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 07: Operators / Social Proof ─────────────────────────────────────

function OperatorsSection() {
  const testimonials = [
    {
      quote: "Sentinel detected a supply chain compromise in our CI/CD pipeline 11 hours before any other tooling registered anomalous behavior.",
      name: "Lt. Col. R. Harmon",
      role: "CISO, Department of Defense — CyberCom",
      cleared: true,
    },
    {
      quote: "We process $4.2 trillion in transactions annually. Sentinel is the only platform we've found that operates at our threat model's required fidelity.",
      name: "Dr. Ingrid Solvang",
      role: "Head of Cyber Risk, Nordic Central Bank",
      cleared: false,
    },
    {
      quote: "After MOVEit, our board demanded an audit of every data egress path. Sentinel mapped our entire attack surface in under 6 hours.",
      name: "[Identity Withheld]",
      role: "CISO, Fortune 50 Healthcare — NDA",
      cleared: false,
    },
  ];

  return (
    <section className="relative px-8 md:px-14 py-24">
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel index="07" label="Operator Statements" />

        <h2
          className="text-3xl md:text-4xl font-bold leading-tight text-cyan-50 mb-14"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Trusted where failure<br />is not an option.
        </h2>

        <div className="flex flex-col gap-0 divide-y" style={{ borderColor: "rgba(0,200,255,0.07)" }}>
          {testimonials.map((t, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8 py-10">
              <blockquote>
                <div className="flex items-start gap-4">
                  <div className="text-cyan-400/20 text-4xl leading-none select-none shrink-0" style={{ fontFamily: "Georgia, serif" }}>"</div>
                  <p
                    className="text-lg leading-[1.7] text-cyan-100/70"
                    style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300 }}
                  >
                    {t.quote}
                  </p>
                </div>
              </blockquote>
              <div className="flex flex-col justify-center md:border-l gap-3 md:pl-8" style={{ borderColor: "rgba(0,200,255,0.08)" }}>
                {t.cleared && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rotate-45" />
                    <MonoLabel className="text-cyan-400/60">TS/SCI CLEARED</MonoLabel>
                  </div>
                )}
                <div
                  className="text-sm font-semibold text-cyan-100/80"
                  style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px" }}
                >
                  {t.name}
                </div>
                <MonoLabel className="text-cyan-500/35">{t.role}</MonoLabel>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 08: CTA ──────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section
      className="relative px-8 md:px-14 py-32 overflow-hidden"
      style={{ borderTop: "1px solid rgba(0,200,255,0.08)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,200,255,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-[1400px] mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-20 bg-cyan-500/20" />
          <MonoLabel className="text-cyan-500/40">CLEARANCE REQUEST</MonoLabel>
          <div className="h-px w-20 bg-cyan-500/20" />
        </div>

        <h2
          className="font-black leading-tight text-cyan-50 mb-6"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
          }}
        >
          READY TO DEFEND<br />
          <span style={{ WebkitTextStroke: "1px rgba(0,200,255,0.35)", color: "transparent" }}>
            YOUR PERIMETER?
          </span>
        </h2>

        <p
          className="text-base leading-relaxed max-w-lg mx-auto mb-10"
          style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, color: "rgba(200,223,245,0.4)" }}
        >
          Sentinel onboarding begins with a classified threat assessment of your
          current environment. No sales deck. No generic demos.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            className="px-10 py-4 text-[11px] tracking-[0.22em] uppercase transition-all duration-200"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "#030b14",
              background: "#00c8ff",
              border: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#33d4ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#00c8ff")}
          >
            Request Clearance →
          </button>
          <button
            className="px-10 py-4 text-[11px] tracking-[0.22em] uppercase transition-all duration-200"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "rgba(200,223,245,0.4)",
              background: "transparent",
              border: "1px solid rgba(0,200,255,0.15)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,200,255,0.3)"; e.currentTarget.style.color = "rgba(200,223,245,0.7)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,200,255,0.15)"; e.currentTarget.style.color = "rgba(200,223,245,0.4)"; }}
          >
            Download Threat Assessment
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="px-8 md:px-14 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ borderTop: "1px solid rgba(0,200,255,0.08)" }}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-5 h-5 shrink-0">
          <div className="absolute inset-0 border border-cyan-400/40 rotate-45" />
          <div className="absolute inset-[3px] bg-cyan-400/80" />
        </div>
        <MonoLabel className="text-cyan-500/35">SENTINEL DEFENSE SYSTEMS · ALL RIGHTS RESERVED · 2025</MonoLabel>
      </div>
      <MonoLabel className="text-cyan-500/20">CLASSIFIED // AUTHORIZED USE ONLY</MonoLabel>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="relative min-h-screen" style={{ background: "#030b14", color: "#c8dff5" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,200,255,0.15); }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,200,255,0.3); }
        @keyframes scaleY { 0%,100% { transform: scaleY(1); opacity: 0.3; } 50% { transform: scaleY(0.5); opacity: 0.15; } }
      `}</style>

      <GridOverlay />
      <Nav />

      <main>
        <HeroSection />
        <ThreatFeedSection />
        <StatsSection />
        <TimelineSection />
        <ArchSection />
        <ComplianceSection />
        <OperatorsSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
