import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import portfolioImg from "../assets/portfolio.png"

// ─── Shared spiral geometry constants ─────────────────────────────────────────
// The canvas draws its spiral at (vw*CX_PCT, vh*CY_PCT) with maxR = vh*R_PCT
// The StickyOrb mirrors these EXACT values so image sits at the spiral's true centre.
const CX_PCT  = 0.64;   // 64% from left
const CY_PCT  = 0.46;   // 46% from top  (slightly lower for visual balance)
const R_PCT   = 0.40;   // spiral maxRadius = 40% of viewport height

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: "01", title: "Poultry Farms: Nash Equilibrium via MR Simulation", period: "Sep 2023 – Dec 2023", tags: ["Python", "ML", "Simulation"], desc: "Formulated an innovative Nash Equilibrium strategy to optimise revenue for poultry farms through mixed-reality simulation environments." },
  { id: "02", title: "Sudoku Solver with Backtrack Search", period: "Feb 2023 – May 2023", tags: ["Flask", "Python", "AI"], desc: "Built a user-friendly Flask app for solving Sudoku puzzles with advanced backtracking and real-time step-by-step visualisation." },
  { id: "03", title: "Cryptocurrency Price Forecasting", period: "Sep 2022 – Dec 2022", tags: ["TensorFlow", "Python", "Finance"], desc: "Led a team of three building neural networks to predict crypto price movements with high temporal accuracy across five assets." },
];

const EXPERIENCE = [
  { role: "Senior Software Engineer", company: "TechCorp Inc.", period: "Jun 2022 – Present", desc: "Architected distributed systems handling 50M+ daily requests. Led 8 engineers, driving a 60% reduction in P99 latency through deep systems optimisation." },
  { role: "Full Stack Developer", company: "StartupXYZ", period: "Jan 2020 – May 2022", desc: "Led development of a SaaS dashboard serving 500+ enterprise clients. Shipped 20+ features with React, Node.js and PostgreSQL across 4 product verticals." },
  { role: "Research Assistant", company: "University Lab", period: "Sep 2018 – Dec 2019", desc: "Published two peer-reviewed papers on transformer architecture optimisation for low-resource NLP tasks." },
];

const EDUCATION = [
  { degree: "MS Computer Science", school: "University of Delaware", year: "2022 – 2024" },
  { degree: "Bachelor of Engineering", school: "R.V. College of Engineering", year: "2018 – 2022" },
];

const CERTS = [
  { title: "NLP with Probabilistic Models", org: "DeepLearning.AI", date: "Apr 2024" },
  { title: "NLP with Sequence Models",      org: "DeepLearning.AI", date: "Apr 2024" },
  { title: "NLP with Classification & Vector Spaces", org: "DeepLearning.AI", date: "Apr 2024" },
];

const SKILLS = [
  { name: "React / Next.js",   pct: 97 },
  { name: "TypeScript / Node", pct: 93 },
  { name: "System Design",     pct: 90 },
  { name: "UI / UX Design",    pct: 88 },
  { name: "ML / Python",       pct: 82 },
];

// Badges placed at compass points OUTSIDE the outermost spiral ring
// Positions are expressed as offsets from the orb container centre (unitless, scaled below)
const BADGES = [
  { label: "Developer", sub: "+ 10 yrs", icon: "</>", angle: 35,  delay: 0.0 },  // top-right
  { label: "Educator",  sub: "+ 3 yrs",  icon: "🎓",  angle: 150, delay: 0.15 }, // left
  { label: "Engineer",  sub: "+ 10 yrs", icon: "⚙️",  angle: 220, delay: 0.3 },  // bottom-left
  { label: "Designer",  sub: "+ 5 yrs",  icon: "✦",   angle: 315, delay: 0.45 }, // bottom-right
];

// ─── Canvas: draws spiral whose centre & size the orb will mirror ─────────────
function SpiralCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, t = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      const cx   = canvas.width  * CX_PCT;
      const cy   = canvas.height * CY_PCT;
      const maxR = canvas.height * R_PCT;

      // Radial glow centred on spiral
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.1);
      grd.addColorStop(0,   "rgba(0,220,180,0.10)");
      grd.addColorStop(0.4, "rgba(0,200,160,0.04)");
      grd.addColorStop(1,   "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 7 elliptical rings – identical radii to the CSS rings in StickyOrb
      // Ring i uses radius fraction: RING_FRACS[i]
      const RING_FRACS = [0.98, 0.84, 0.70, 0.56, 0.42, 0.30, 0.18];
      const ASPECT = 0.62; // y-squish keeps ellipse look

      RING_FRACS.forEach((frac, ring) => {
        const r = maxR * frac;
        const pts = 200;
        ctx.beginPath();
        for (let i = 0; i <= pts; i++) {
          const a = (i / pts) * Math.PI * 2;
          const wobble = Math.sin(a * 4 + t * 0.5 + ring * 0.9) * (r * 0.025);
          const x = cx + (r + wobble) * Math.cos(a);
          const y = cy + (r + wobble) * Math.sin(a) * ASPECT;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const alpha = ring < 2 ? 0.55 : 0.22 - ring * 0.02;
        ctx.strokeStyle = `rgba(0,220,180,${Math.max(alpha, 0.06)})`;
        ctx.lineWidth   = ring < 2 ? 1.0 : 0.5;
        ctx.stroke();
      });

      // Faint radial spokes
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2 + t * 0.06;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + maxR * 0.95 * Math.cos(a), cy + maxR * 0.95 * ASPECT * Math.sin(a));
        ctx.strokeStyle = "rgba(0,220,180,0.05)";
        ctx.lineWidth   = 0.3;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ─── Sticky Orb – perfectly aligned with canvas spiral ───────────────────────
function StickyOrb() {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

  // Keep dims in sync with viewport
  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { scrollYProgress } = useScroll();
  const rawY     = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.04, 0.88, 0.96], [0, 1, 1, 0]);
  const springY  = useSpring(rawY, { stiffness: 50, damping: 18 });

  // Mirror canvas geometry exactly
  const maxR   = dims.h * R_PCT;           // px – same as canvas maxR
  const cx     = dims.w * CX_PCT;          // px – spiral centre x
  const cy     = dims.h * CY_PCT;          // px – spiral centre y
  const ORB    = maxR * 2;                 // container spans full spiral diameter

  // Image circle = innermost "ring" (~18% of maxR radius means diameter = 36% of ORB)
  // We place image at 28% of maxR radius for a nice large face
  const IMG_R  = maxR * 0.45;             // image circle radius
  const IMG_D  = IMG_R * 2;

  // Badge placement: just beyond outermost ring
  const BADGE_R = maxR * 1.05;

  return (
    <motion.div
      ref={containerRef}
      style={{
        position: "fixed",
        left: cx - maxR,   // top-left corner of container
        top:  cy - maxR,
        width:  ORB,
        height: ORB,
        zIndex: 2,
        y: springY,
        opacity: rawOpacity,
        pointerEvents: "none",
      }}
    >
      {/* ── CSS rings that exactly mirror the canvas ring radii ── */}
      {/* Canvas RING_FRACS: [0.98, 0.84, 0.70, 0.56, 0.42, 0.30, 0.18]        */}
      {/* Each CSS ring inset = maxR * (1 - frac)  → centres on same cx/cy      */}
      {[
        { frac: 0.98, dur: 60, dir: 1,  lw: "1px",   alpha: 0.18 },
        { frac: 0.84, dur: 45, dir: -1, lw: "1px",   alpha: 0.22 },
        { frac: 0.70, dur: 34, dir: 1,  lw: "1.5px", alpha: 0.28 },
        { frac: 0.56, dur: 25, dir: -1, lw: "1.5px", alpha: 0.35 },
        { frac: 0.42, dur: 18, dir: 1,  lw: "2px",   alpha: 0.45 },
      ].map(({ frac, dur, dir, lw, alpha }, i) => {
        const insetPx = maxR * (1 - frac);
        return (
          <motion.div
            key={i}
            animate={{ rotate: dir * 360 }}
            transition={{ repeat: Infinity, duration: dur, ease: "linear" }}
            style={{
              position: "absolute",
              inset: insetPx,
              borderRadius: "50%",
              border: `${lw} solid rgba(0,220,180,${alpha})`,
              boxShadow: i >= 3 ? `0 0 ${12 + i * 4}px rgba(0,220,180,${alpha * 0.5})` : "none",
            }}
          >
            {/* One glowing orbiting dot per ring (only on outer 3) */}
            {i < 3 && (
              <div style={{
                position: "absolute",
                top: i % 2 === 0 ? "-4px" : "auto",
                bottom: i % 2 === 0 ? "auto" : "-3px",
                left: "50%", transform: "translateX(-50%)",
                width: `${6 - i}px`, height: `${6 - i}px`,
                borderRadius: "50%",
                background: "#00dc96",
                boxShadow: `0 0 ${10 + i * 2}px ${3 + i}px rgba(0,220,180,0.7)`,
              }} />
            )}
          </motion.div>
        );
      })}

      {/* ── Deep atmospheric glow at centre ── */}
      <div style={{
        position: "absolute",
        inset: maxR * (1 - 0.38),   // ~inner 38% radius zone
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,220,180,0.28) 0%, rgba(0,180,140,0.10) 50%, transparent 100%)",
      }} />

      {/* ── Profile image — perfectly centred ── */}
      <div style={{
        position: "absolute",
        left: maxR - IMG_R,  // centre of container ± IMG_R
        top:  maxR - IMG_R,
        width:  IMG_D,
        height: IMG_D,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2.5px solid rgba(0,220,180,0.6)",
        boxShadow: "0 0 50px rgba(0,220,180,0.40), 0 0 100px rgba(0,220,180,0.18), inset 0 0 24px rgba(0,220,180,0.06)",
        background: "#050c0b",
        zIndex: 1,
      }}>
        {/* <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&crop=faces,top"
          alt="John Doe – Senior Software Engineer"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%", filter: "brightness(0.88) contrast(1.1) saturate(0.9)" }}
        /> */}
        <img 
        src={portfolioImg} alt="" 
        style={{ width: "100%", height: "80%", objectFit: "cover", objectPosition: "center 15%", filter: "brightness(0.88) contrast(1.1) saturate(0.9)" }}/>
        {/* Bottom vignette blends into dark bg */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,12,11,0.72) 0%, transparent 55%)", pointerEvents: "none" }} />
        {/* Scan shimmer */}
        <motion.div
          animate={{ top: ["-100%", "220%"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear", repeatDelay: 5 }}
          style={{ position: "absolute", left: 0, right: 0, height: "35%", background: "linear-gradient(to bottom, transparent, rgba(0,220,180,0.07), transparent)", pointerEvents: "none" }}
        />
      </div>

      {/* ── Floating badges — placed at even compass angles, OUTSIDE outermost ring ── */}
      {BADGES.map((b) => {
        // Convert angle to x,y offset from container centre (maxR, maxR)
        const rad  = (b.angle * Math.PI) / 180;
        const bx   = maxR + BADGE_R * Math.cos(rad);  // centre of badge
        const by   = maxR + BADGE_R * Math.sin(rad);

        return (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 + b.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              left: bx,
              top:  by,
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
              zIndex: 3,
            }}
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 3.5 + b.delay * 2, ease: "easeInOut", delay: b.delay }}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 14px",
                background: "rgba(3, 10, 8, 0.92)",
                border: "1px solid rgba(0,220,180,0.35)",
                borderRadius: "6px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.7), 0 0 20px rgba(0,220,180,0.12)",
                backdropFilter: "blur(16px)",
                whiteSpace: "nowrap",
                cursor: "default",
              }}
            >
              <div style={{
                width: "28px", height: "28px", borderRadius: "5px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0,220,180,0.12)", color: "#00dc96",
                fontSize: "11px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                flexShrink: 0,
              }}>{b.icon}</div>
              <div>
                <div style={{ color: "#cce8df", fontSize: "12px", fontWeight: 700, fontFamily: "'Syne', sans-serif", lineHeight: 1.2 }}>{b.label}</div>
                <div style={{ color: "#008a60", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>{b.sub}</div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} style={{ marginBottom: "52px" }}>
      <motion.div initial={{ opacity: 0, x: -36 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(40px,5vw,60px)", fontWeight: 900, color: "#00dc96", lineHeight: 1, letterSpacing: "-0.02em" }}>{title}</h2>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(40px,5vw,60px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", WebkitTextStroke: "1px rgba(0,220,180,0.2)", color: "transparent", marginTop: "-3px" }}>{title}</h2>
      </motion.div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: "relative", borderBottom: "1px solid rgba(0,220,180,0.10)", paddingBottom: "24px", marginBottom: "24px", cursor: "pointer", transition: "background 0.3s", padding: "10px 12px 24px", borderRadius: "4px", background: hov ? "rgba(0,220,180,0.025)" : "transparent" }}
    >
      <div style={{ display: "flex", gap: "16px" }}>
        <span style={{ color: "#1a5040", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px", flexShrink: 0 }}>{project.id}</span>
        <div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", color: hov ? "#00dc96" : "#cce8df", fontWeight: 600, fontSize: "14px", lineHeight: 1.4, marginBottom: "5px", transition: "color 0.3s" }}>{project.title}</h3>
          <p style={{ color: "#006a50", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px" }}>{project.period}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "8px" }}>
            {project.tags.map(t => <span key={t} style={{ fontSize: "10px", border: "1px solid rgba(0,220,180,0.18)", color: "#009a72", padding: "2px 8px", fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>)}
          </div>
          <p style={{ color: "#3a6058", fontSize: "12px", lineHeight: 1.65 }}>{project.desc}</p>
        </div>
      </div>
      <motion.div style={{ position: "absolute", left: 0, bottom: 0, height: "1px", background: "linear-gradient(90deg, #00dc96, transparent)" }} initial={{ width: 0 }} animate={{ width: hov ? "100%" : 0 }} transition={{ duration: 0.4 }} />
    </motion.div>
  );
}

// ─── Skill Bar ────────────────────────────────────────────────────────────────
function SkillBar({ name, pct, delay }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ marginBottom: "11px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "10px", color: "#2a6050", fontFamily: "'JetBrains Mono', monospace" }}>{name}</span>
        <span style={{ fontSize: "10px", color: "#006a50", fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
      </div>
      <div style={{ height: "2px", background: "rgba(0,220,180,0.08)", borderRadius: "2px", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}}
          transition={{ delay, duration: 1.1, ease: "easeOut" }}
          style={{ height: "100%", background: "linear-gradient(90deg, #005a40, #00dc96)", boxShadow: "0 0 8px rgba(0,220,180,0.45)" }}
        />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroRef    = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #040b0a; }
        ::-webkit-scrollbar-thumb { background: #00dc96; border-radius: 2px; }
        body::after {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1000;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.35;
        }
      `}</style>

      <div style={{ background: "#050c0b", color: "#e0f0ee", fontFamily: "'JetBrains Mono', monospace", minHeight: "100vh", position: "relative" }}>

        <SpiralCanvas />
        <StickyOrb />

        {/* Scroll progress bar */}
        <motion.div style={{ position: "fixed", top: 0, left: 0, height: "2px", background: "#00dc96", zIndex: 50, width: progressWidth, boxShadow: "0 0 6px #00dc96" }} />

        {/* ── Sidebar nav ─────────────────────────────────────── */}
        <nav style={{ position: "fixed", left: 0, top: 0, height: "100%", width: "52px", zIndex: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "22px" }}>
          {["Resume", "Contact", "About", "Blog"].map((link, i) => (
            <motion.a key={link} href={`#${link.toLowerCase()}`}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#1a4a38", textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#00dc96"}
              onMouseLeave={e => e.currentTarget.style.color = "#1a4a38"}
            >{link}</motion.a>
          ))}
          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.1, duration: 0.8 }} style={{ width: "1px", height: "52px", background: "rgba(0,220,180,0.15)", marginTop: "6px" }} />
        </nav>

        {/* ── Logo ─────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ position: "fixed", top: "22px", left: "60px", zIndex: 40 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 900, color: "#00dc96", textShadow: "0 0 24px rgba(0,220,180,0.5)" }}>
            J<span style={{ color: "#e0f0ee" }}>.</span>
          </span>
        </motion.div>

        {/* ── Top-right contact ────────────────────────────────── */}
        <motion.header initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ position: "fixed", top: 0, right: 0, zIndex: 40, padding: "20px 24px" }}>
          <a href="#contact"
            style={{ fontSize: "10px", border: "1px solid rgba(0,220,180,0.45)", color: "#00dc96", padding: "8px 18px", textDecoration: "none", letterSpacing: "0.09em", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.25s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00dc96"; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00dc96"; }}
          >Contact</a>
        </motion.header>

        {/* ── Right socials ────────────────────────────────────── */}
        <div style={{ position: "fixed", right: "18px", top: "50%", transform: "translateY(-50%)", zIndex: 40, display: "flex", flexDirection: "column", gap: "14px" }}>
          {["GH","LI","TW"].map((s, i) => (
            <motion.a key={s} href="#" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.08 }}
              style={{ fontSize: "10px", color: "#1a4a38", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", transition: "color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#00dc96"}
              onMouseLeave={e => e.currentTarget.style.color = "#1a4a38"}
            >{s}</motion.a>
          ))}
        </div>

        {/* ════════════════════════════ HERO ══════════════════════════════════ */}
        <section
          id="home"
          ref={heroRef}
          style={{
            position: "relative", zIndex: 3,
            minHeight: "100vh", display: "flex", alignItems: "center",
            // Content lives in the LEFT 46% – right side belongs to the spiral
            paddingLeft: "72px", paddingRight: "56%",
          }}
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35, duration: 0.55 }}
              style={{ color: "#006a50", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "16px" }}
            >// hello world</motion.p>

            {["Developer", "Designer", "Creator"].map((word, i) => (
              <motion.h1
                key={word}
                initial={{ opacity: 0, x: -60 }} animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.45 + i * 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em", lineHeight: 1, fontWeight: 900,
                  ...(i === 0
                    ? { fontSize: "clamp(50px,6.5vw,76px)", color: "#00dc96", textShadow: "0 0 30px rgba(0,220,180,0.5)" }
                    : i === 1
                    ? { fontSize: "clamp(38px,5vw,60px)",   color: "rgba(0,200,160,0.52)" }
                    : { fontSize: "clamp(28px,4vw,48px)",   color: "rgba(0,180,140,0.26)" }),
                }}
              >{word}</motion.h1>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.9, duration: 0.55 }}
              style={{ color: "#3a7060", fontSize: "13px", lineHeight: 1.75, maxWidth: "360px", marginTop: "20px" }}
            >
              Seasoned engineer who thinks in systems and ships in pixels. 10+ years
              crafting performant, beautiful products from kernel to canvas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.1, duration: 0.55 }}
              style={{ display: "flex", gap: "12px", marginTop: "28px" }}
            >
              {[["View Work","#projects","filled"],["Let's Talk","#contact","outline"]].map(([label, href, type]) => (
                <a key={label} href={href}
                  style={{ fontSize: "11px", fontWeight: type === "filled" ? 700 : 400, padding: "11px 26px", textDecoration: "none", letterSpacing: "0.06em", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.25s",
                    ...(type === "filled"
                      ? { background: "#00dc96", color: "#000" }
                      : { border: "1px solid rgba(0,220,180,0.35)", color: "#00dc96", background: "transparent" })
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = type === "filled" ? "#00ffb3" : "rgba(0,220,180,0.06)"; e.currentTarget.style.borderColor = "#00dc96"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = type === "filled" ? "#00dc96" : "transparent"; e.currentTarget.style.borderColor = "rgba(0,220,180,0.35)"; }}
                >{label}</a>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={heroInView ? { opacity: 1 } : {}} transition={{ delay: 1.35, duration: 0.6 }} style={{ marginTop: "44px", maxWidth: "300px" }}>
              {SKILLS.map((s, i) => <SkillBar key={s.name} name={s.name} pct={s.pct} delay={1.4 + i * 0.08} />)}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
            style={{ position: "absolute", bottom: "36px", left: "72px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <motion.div animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ width: "1px", height: "44px", background: "linear-gradient(to bottom, #00dc96, transparent)" }} />
            <span style={{ fontSize: "9px", color: "#1a4a38", writingMode: "vertical-rl", letterSpacing: "0.14em" }}>scroll</span>
          </motion.div>
        </section>

        {/* ════════════════════════ PROJECTS ══════════════════════════════════ */}
        <section id="projects" style={{ position: "relative", zIndex: 3, padding: "96px 0 80px 72px", paddingRight: "56%" }}>
          <SectionHeader title="Projects" />
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          <motion.button whileHover={{ borderColor: "#00dc96", color: "#00dc96" }}
            style={{ fontSize: "10px", border: "1px solid rgba(0,220,180,0.22)", color: "#006a50", padding: "9px 20px", background: "transparent", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", marginTop: "6px", transition: "all 0.25s" }}
          >View All →</motion.button>
        </section>

        {/* ════════════════════════ EXPERIENCE ════════════════════════════════ */}
        <section id="experience" style={{ position: "relative", zIndex: 3, padding: "80px 0 80px 72px", paddingRight: "56%" }}>
          <SectionHeader title="Experience" />
          <div style={{ borderLeft: "1px solid rgba(0,220,180,0.12)", paddingLeft: "26px" }}>
            {EXPERIENCE.map((exp, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              return (
                <motion.div key={i} ref={ref} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.12, duration: 0.55 }}
                  style={{ position: "relative", paddingBottom: "32px" }}>
                  <div style={{ position: "absolute", left: "-33px", top: "5px", width: "7px", height: "7px", borderRadius: "50%", background: "#050c0b", border: "1px solid rgba(0,220,180,0.4)", transition: "all 0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#00dc96"; e.currentTarget.style.boxShadow = "0 0 10px rgba(0,220,180,0.8)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#050c0b"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  <span style={{ fontSize: "10px", color: "#006a50", fontFamily: "'JetBrains Mono', monospace" }}>{exp.period}</span>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", color: "#cce8df", fontWeight: 700, marginTop: "3px", fontSize: "15px" }}>{exp.role}</h3>
                  <p style={{ color: "#009a72", fontSize: "11px", marginBottom: "7px", fontFamily: "'JetBrains Mono', monospace" }}>{exp.company}</p>
                  <p style={{ color: "#3a6058", fontSize: "12px", lineHeight: 1.65 }}>{exp.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════ ABOUT ═════════════════════════════════════ */}
        <section id="about" style={{ position: "relative", zIndex: 3, padding: "80px 0 80px 72px", paddingRight: "56%" }}>
          <SectionHeader title="About" />
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
            style={{ color: "#3a7060", fontSize: "13px", lineHeight: 1.8, marginBottom: "32px" }}
          >
            I'm a seasoned engineer with 10+ years shipping production systems — from distributed
            backends to pixel-perfect interfaces. I believe great software is equally rigorous and
            beautiful, and I thrive at the intersection of deep engineering and design thinking.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ marginBottom: "36px" }}>
            <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#cce8df", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "16px" }}>Education</h3>
            {EDUCATION.map((e, i) => (
              <div key={i} style={{ marginBottom: "14px" }}>
                <span style={{ color: "#005a40", fontSize: "10px" }}>{String(i + 1).padStart(2, "0")}</span>
                <p style={{ color: "#00b890", fontSize: "11px", fontWeight: 600, marginTop: "2px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{e.school}</p>
                <p style={{ color: "#3a6058", fontSize: "11px" }}>{e.year} · {e.degree}</p>
              </div>
            ))}
            <motion.button whileHover={{ borderColor: "#00dc96", color: "#00dc96" }}
              style={{ fontSize: "10px", border: "1px solid rgba(0,220,180,0.22)", color: "#006a50", padding: "8px 16px", background: "transparent", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.09em", marginTop: "6px", transition: "all 0.25s" }}
            >Full Resume →</motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }}>
            <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#cce8df", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "16px" }}>Certifications</h3>
            {CERTS.map((c, i) => (
              <div key={i} style={{ marginBottom: "14px", borderLeft: "1px solid rgba(0,220,180,0.15)", paddingLeft: "12px" }}>
                <span style={{ color: "#005a40", fontSize: "10px" }}>{String(i + 1).padStart(2, "0")}</span>
                <p style={{ color: "#cce8df", fontSize: "11px", fontWeight: 600, marginTop: "2px", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.title}</p>
                <p style={{ color: "#005a40", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace" }}>{c.date} · {c.org}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ════════════════════════ CONTACT ═══════════════════════════════════ */}
        <section id="contact" style={{ position: "relative", zIndex: 3, padding: "80px 0 80px 72px", paddingRight: "56%" }}>
          <SectionHeader title="Contact" />
          <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ color: "#3a7060", fontSize: "13px", lineHeight: 1.75, marginBottom: "32px" }}
          >
            Looking for a versatile senior engineer who cares as much about craft as performance?
            I'd love to hear about your project.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {[{ label: "NAME", placeholder: "John Doe", type: "text" }, { label: "EMAIL", placeholder: "johndoe@gmail.com", type: "email" }].map(f => (
              <div key={f.label}>
                <label style={{ display: "block", color: "#005a40", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "7px", fontFamily: "'JetBrains Mono', monospace" }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  style={{ width: "100%", background: "transparent", border: "1px solid rgba(0,220,180,0.16)", color: "#cce8df", fontSize: "12px", padding: "11px 14px", outline: "none", fontFamily: "'JetBrains Mono', monospace", transition: "border-color 0.25s" }}
                  onFocus={e => e.target.style.borderColor = "rgba(0,220,180,0.5)"}
                  onBlur={e  => e.target.style.borderColor = "rgba(0,220,180,0.16)"}
                />
              </div>
            ))}
            <div>
              <label style={{ display: "block", color: "#005a40", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "7px", fontFamily: "'JetBrains Mono', monospace" }}>MESSAGE</label>
              <textarea rows={5} placeholder="Tell me about your project..."
                style={{ width: "100%", background: "transparent", border: "1px solid rgba(0,220,180,0.16)", color: "#cce8df", fontSize: "12px", padding: "11px 14px", outline: "none", resize: "none", fontFamily: "'JetBrains Mono', monospace", transition: "border-color 0.25s" }}
                onFocus={e => e.target.style.borderColor = "rgba(0,220,180,0.5)"}
                onBlur={e  => e.target.style.borderColor = "rgba(0,220,180,0.16)"}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <motion.button whileHover={{ background: "#00ffb3" }}
                style={{ fontSize: "11px", background: "#00dc96", color: "#000", padding: "12px 30px", border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", transition: "background 0.25s" }}
              >Send →</motion.button>
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ position: "relative", zIndex: 3, padding: "24px 52px 24px 72px", borderTop: "1px solid rgba(0,220,180,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#1a3a2e", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace" }}>© 2024 John Doe</span>
          <span style={{ color: "#1a3a2e", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace" }}>React · Framer Motion</span>
        </footer>

      </div>
    </>
  );
}