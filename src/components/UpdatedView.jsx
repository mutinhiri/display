import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import portfolioImg from "../assets/portfolio.png";

// ─── SPIRAL GEOMETRY (canvas + orb share identical values) ───────────────────
const CX_PCT = 0.64;  // spiral centre: 64% from left
const CY_PCT = 0.46;  // spiral centre: 46% from top
const R_PCT  = 0.40;  // spiral radius: 40% of viewport height

// ─── LAYOUT ──────────────────────────────────────────────────────────────────
// The right 44% of the screen is reserved for the sticky spiral/orb.
// Content lives in the left 56% minus the 64px sidebar.
const SIDEBAR = 64;           // px — left sidebar
const CONTENT_L = SIDEBAR + 40; // px — content left edge
const CONTENT_MAX = 560;      // px — max content width

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  bg:       "#050c0b",
  teal:     "#00dc96",
  tealMid:  "rgba(0,220,180,0.35)",
  tealFaint:"rgba(0,220,180,0.12)",
  heading:  "#d4ede5",
  body:     "#5a8878",
  muted:    "rgba(0,220,180,0.28)",
  accent:   "#009a72",
  border:   "rgba(0,220,180,0.10)",
};
const MONO = { fontFamily:"'JetBrains Mono',monospace" };
const SYNE = { fontFamily:"'Syne',sans-serif" };

// Section wrapper — content capped at CONTENT_MAX, never enters spiral zone
const SEC = {
  position:"relative", zIndex:3,
  paddingTop:"104px", paddingBottom:"104px",
  paddingLeft:`${CONTENT_L}px`,
  // Right padding = 44% of viewport keeps content clear of spiral on any screen
  paddingRight:"44%",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id:"01", title:"Eduverse", tags:["NestJs","React","AWS"], desc:"Engineered a centralized management system to automate academic workflows and student data tracking via a unified digital portal. Developed automated grading scripts and a secure SQL database to streamline administrative tasks and improve data accessibility." },
  { id:"02", title:"Contractor Management Tracking",      tags:["React","NestJs","AI"],       desc:"Developed a project management tool to coordinate external contractors and monitor billable hours through real-time time tracking modules. Built automated invoicing pipelines and a secure vendor portal to reduce administrative overhead and improve payroll accuracy for multi-entity companies." },
  // { id:"03", title:"Cryptocurrency Price Forecasting",      period:"Sep 2022 – Dec 2022", tags:["TensorFlow","Python","Finance"], desc:"Led a team building neural networks to predict crypto price movements with high temporal accuracy across five assets." },
];
const EXPERIENCE = [
  { role:"Software Engineer", company:"Piktochart AI",  period:"Oct 2025 – Feb 2026",  desc:"Contributed to backend development for AI-driven infographics features. Improved PostgreSQL database efficiency through query optimization" },
  { role:"Software Engineering Team Lead",     company:"Velocity Inc Tech",     period:"Feb 2023 – Sep 2025", desc:"Led development of a SaaS dashboard serving 500+ enterprise clients across 4 product verticals with React, Node.js and PostgreSQL." },
  { role:"Software Engineer",       company:"HperionDev", period:"Sep 2021 – Feb 2023", desc:"Mentored junior developers through code reviews, pair programming, and technical training. " },
  { role:"Full Stack Developer",       company:"UBITECH", period:"Jul 2019 – Feb 2021", desc:"Built customer-facing applications for table reservations, online ordering, and loyalty programs. " },

];
const EDUCATION = [
  { degree:"Full Stack Software Engineering",     school:"MICROVERSE",      year:"2021 – 2022" },
  { degree:"Bachelor of Business", school:"Midlands State University", year:"2016 – 2020" },
];
const CERTS = [
  { title:"AWS Certified Developer Associate",           org:"Amazon Web Services", date:"Jan 2025" },
  { title:"AWS Certified Cloud Practitioner",                org:"Amazon Web Services", date:"Apr 2024" },
  // { title:"NLP with Classification & Vector Spaces", org:"DeepLearning.AI", date:"Apr 2024" },
];
const SKILLS = [
  { name:"React / Next.js",   pct:97 },
  { name:"TypeScript / Node", pct:93 },
   { name:"AWS / Cloud",       pct:82 },
  { name:"System Design",     pct:90 },
  { name:"Ruby / Rails",      pct:88 },
  { name:"UI / UX Design",    pct:88 },
  { name:"ML / Python",       pct:82 },
];
const BADGES = [
  { label:"Developer", sub:"+10 yrs", icon:"</>", angle:35,  delay:0.00 },
  { label:"Architect",  sub:"+ 3 yrs", icon:"⚙️",  angle:150, delay:0.15 },
  { label:"Engineer",  sub:"+10 yrs", icon:"⚙️",  angle:220, delay:0.30 },
  { label:"Designer",  sub:"+ 5 yrs", icon:"✦",   angle:315, delay:0.45 },
];

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  try {
    const response = await fetch("https://formspree.io/f/xkoqvzqp", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json' // This tells Formspree to expect/return JSON
      },
    });

    if (response.ok) {
      alert("Message sent!");
    } else {
      console.error("Submission failed");
    }
  } catch (error) {
    console.error("Network error", error);
  }
};
// ─── SPIRAL CANVAS ───────────────────────────────────────────────────────────
function SpiralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, t = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); t += 0.008;
      const cx = canvas.width * CX_PCT, cy = canvas.height * CY_PCT, maxR = canvas.height * R_PCT;
      const grd = ctx.createRadialGradient(cx,cy,0,cx,cy,maxR*1.1);
      grd.addColorStop(0,"rgba(0,220,180,0.10)"); grd.addColorStop(0.4,"rgba(0,200,160,0.04)"); grd.addColorStop(1,"transparent");
      ctx.fillStyle = grd; ctx.fillRect(0,0,canvas.width,canvas.height);
      [0.98,0.84,0.70,0.56,0.42,0.30,0.18].forEach((frac,ring) => {
        const r = maxR*frac; ctx.beginPath();
        for (let i=0;i<=200;i++){
          const a=(i/200)*Math.PI*2, w=Math.sin(a*4+t*0.5+ring*0.9)*(r*0.025);
          const x=cx+(r+w)*Math.cos(a), y=cy+(r+w)*Math.sin(a)*0.62;
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.strokeStyle=`rgba(0,220,180,${Math.max(ring<2?0.55:0.22-ring*0.02,0.06)})`;
        ctx.lineWidth=ring<2?1.0:0.5; ctx.stroke();
      });
      for(let i=0;i<36;i++){
        const a=(i/36)*Math.PI*2+t*0.06;
        ctx.beginPath(); ctx.moveTo(cx,cy);
        ctx.lineTo(cx+maxR*0.95*Math.cos(a), cy+maxR*0.95*0.62*Math.sin(a));
        ctx.strokeStyle="rgba(0,220,180,0.05)"; ctx.lineWidth=0.3; ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

// ─── STICKY ORB ──────────────────────────────────────────────────────────────
function StickyOrb() {
  const [dims, setDims] = useState({w:window.innerWidth,h:window.innerHeight});
  useEffect(() => {
    const fn = () => setDims({w:window.innerWidth,h:window.innerHeight});
    window.addEventListener("resize",fn); return ()=>window.removeEventListener("resize",fn);
  },[]);
  const {scrollYProgress} = useScroll();
  const rawY   = useTransform(scrollYProgress,[0,1],[0,-28]);
  const rawOp  = useTransform(scrollYProgress,[0,0.04,0.88,0.96],[0,1,1,0]);
  const springY = useSpring(rawY,{stiffness:50,damping:18});

  const maxR   = dims.h * R_PCT;
  const cx     = dims.w * CX_PCT;
  const cy     = dims.h * CY_PCT;
  const ORB    = maxR * 2;
  const IMG_R  = maxR * 0.45;
  const IMG_D  = IMG_R * 2;
  const BADGE_R = maxR * 1.05;

  return (
    <motion.div style={{position:"fixed",left:cx-maxR,top:cy-maxR,width:ORB,height:ORB,zIndex:2,y:springY,opacity:rawOp,pointerEvents:"none"}}>
      {/* Rings */}
      {[{frac:0.98,dur:60,dir:1,lw:"1px",a:0.18},{frac:0.84,dur:45,dir:-1,lw:"1px",a:0.22},
        {frac:0.70,dur:34,dir:1,lw:"1.5px",a:0.28},{frac:0.56,dur:25,dir:-1,lw:"1.5px",a:0.35},
        {frac:0.42,dur:18,dir:1,lw:"2px",a:0.45}].map(({frac,dur,dir,lw,a},i)=>(
        <motion.div key={i} animate={{rotate:dir*360}} transition={{repeat:Infinity,duration:dur,ease:"linear"}}
          style={{position:"absolute",inset:maxR*(1-frac),borderRadius:"50%",
            border:`${lw} solid rgba(0,220,180,${a})`,
            boxShadow:i>=3?`0 0 ${12+i*4}px rgba(0,220,180,${a*0.5})`:"none"}}>
          {i<3&&<div style={{position:"absolute",top:i%2===0?"-4px":"auto",bottom:i%2===0?"auto":"-3px",
            left:"50%",transform:"translateX(-50%)",width:`${6-i}px`,height:`${6-i}px`,borderRadius:"50%",
            background:C.teal,boxShadow:`0 0 ${10+i*2}px ${3+i}px rgba(0,220,180,0.7)`}}/>}
        </motion.div>
      ))}
      {/* Glow */}
      <div style={{position:"absolute",inset:maxR*(1-0.38),borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,220,180,0.28) 0%,rgba(0,180,140,0.10) 50%,transparent 100%)"}}/>
      {/* Image */}
      <div style={{position:"absolute",left:maxR-IMG_R,top:maxR-IMG_R,width:IMG_D,height:IMG_D,
        borderRadius:"50%",overflow:"hidden",border:"2.5px solid rgba(0,220,180,0.6)",
        boxShadow:"0 0 50px rgba(0,220,180,0.40),0 0 100px rgba(0,220,180,0.18)",zIndex:1}}>
        <img src={portfolioImg} alt="Profile"
          style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 20%",
            filter:"brightness(0.88) contrast(1.1) saturate(0.9)"}}/>
        <motion.div animate={{top:["-100%","220%"]}} transition={{repeat:Infinity,duration:4,ease:"linear",repeatDelay:5}}
          style={{position:"absolute",left:0,right:0,height:"35%",
            background:"linear-gradient(to bottom,transparent,rgba(0,220,180,0.07),transparent)",pointerEvents:"none"}}/>
      </div>
      {/* Badges */}
      {BADGES.map(b=>{
        const rad=(b.angle*Math.PI)/180;
        const bx=maxR+BADGE_R*Math.cos(rad), by=maxR+BADGE_R*Math.sin(rad);
        return (
          <motion.div key={b.label} initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}}
            transition={{delay:1.8+b.delay,duration:0.6,ease:[0.16,1,0.3,1]}}
            style={{position:"absolute",left:bx,top:by,transform:"translate(-50%,-50%)",pointerEvents:"auto",zIndex:3}}>
            <motion.div animate={{y:[0,-7,0]}} transition={{repeat:Infinity,duration:3.5+b.delay*2,ease:"easeInOut",delay:b.delay}}
              style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 16px",
                background:"rgba(3,10,8,0.93)",border:"1px solid rgba(0,220,180,0.35)",borderRadius:"8px",
                boxShadow:"0 12px 40px rgba(0,0,0,0.7),0 0 20px rgba(0,220,180,0.12)",
                backdropFilter:"blur(16px)",whiteSpace:"nowrap",cursor:"default"}}>
              <div style={{width:"32px",height:"32px",borderRadius:"6px",display:"flex",alignItems:"center",
                justifyContent:"center",background:"rgba(0,220,180,0.12)",color:C.teal,
                fontSize:"13px",fontWeight:700,...MONO,flexShrink:0}}>{b.icon}</div>
              <div>
                <div style={{color:C.heading,fontSize:"14px",fontWeight:700,...SYNE,lineHeight:1.2}}>{b.label}</div>
                <div style={{color:"#008a60",fontSize:"12px",...MONO,marginTop:"2px"}}>{b.sub}</div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({title}) {
  const ref = useRef(null);
  const inView = useInView(ref,{once:true,margin:"-80px"});
  return (
    <div ref={ref} style={{marginBottom:"48px"}}>
      <motion.div initial={{opacity:0,x:-32}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:0.7}}>
        <h2 style={{...SYNE,fontSize:"clamp(36px,4.5vw,56px)",fontWeight:900,color:C.teal,lineHeight:1,letterSpacing:"-0.02em"}}>{title}</h2>
        <h2 style={{...SYNE,fontSize:"clamp(36px,4.5vw,56px)",fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",
          WebkitTextStroke:"1px rgba(0,220,180,0.18)",color:"transparent",marginTop:"-3px"}}>{title}</h2>
      </motion.div>
    </div>
  );
}

// ─── SKILL BAR ───────────────────────────────────────────────────────────────
function SkillBar({name,pct,delay}) {
  const ref = useRef(null);
  const inView = useInView(ref,{once:true});
  return (
    <div ref={ref} style={{marginBottom:"14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
        <span style={{fontSize:"14px",color:"#4a8070",...MONO}}>{name}</span>
        <span style={{fontSize:"14px",color:C.accent,...MONO,fontWeight:500}}>{pct}%</span>
      </div>
      <div style={{height:"3px",background:"rgba(0,220,180,0.08)",borderRadius:"2px",overflow:"hidden"}}>
        <motion.div initial={{width:0}} animate={inView?{width:`${pct}%`}:{}} transition={{delay,duration:1.1,ease:"easeOut"}}
          style={{height:"100%",background:"linear-gradient(90deg,#005a40,#00dc96)",boxShadow:"0 0 8px rgba(0,220,180,0.45)"}}/>
      </div>
    </div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({project,index}) {
  const ref = useRef(null);
  const inView = useInView(ref,{once:true,margin:"-60px"});
  const [hov,setHov] = useState(false);
  return (
    <motion.div ref={ref} initial={{opacity:0,y:28}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.55,delay:index*0.1}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{position:"relative",borderBottom:`1px solid ${C.border}`,paddingBottom:"28px",marginBottom:"28px",
        cursor:"pointer",padding:"14px 16px 28px",borderRadius:"6px",
        background:hov?"rgba(0,220,180,0.025)":"transparent",transition:"background 0.3s"}}>
      <div style={{display:"flex",gap:"20px"}}>
        <span style={{color:"rgba(0,220,180,0.22)",fontSize:"13px",...MONO,marginTop:"3px",flexShrink:0}}>{project.id}</span>
        <div style={{flex:1}}>
          <h3 style={{...SYNE,color:hov?C.teal:C.heading,fontWeight:700,fontSize:"18px",lineHeight:1.35,marginBottom:"8px",transition:"color 0.3s"}}>{project.title}</h3>
          <p style={{color:C.accent,fontSize:"13px",...MONO,marginBottom:"10px"}}>{project.period}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"12px"}}>
            {project.tags.map(t=><span key={t} style={{fontSize:"12px",border:"1px solid rgba(0,220,180,0.2)",color:"#009a72",padding:"4px 12px",...MONO,borderRadius:"3px"}}>{t}</span>)}
          </div>
          <p style={{color:C.body,fontSize:"15px",lineHeight:1.8}}>{project.desc}</p>
        </div>
      </div>
      <motion.div style={{position:"absolute",left:0,bottom:0,height:"1px",background:"linear-gradient(90deg,#00dc96,transparent)"}}
        initial={{width:0}} animate={{width:hov?"100%":0}} transition={{duration:0.4}}/>
    </motion.div>
  );
}

// ─── EXPERIENCE ITEM ─────────────────────────────────────────────────────────
function ExperienceItem({exp,index}) {
  const ref = useRef(null);
  const inView = useInView(ref,{once:true,margin:"-60px"});
  return (
    <motion.div ref={ref} initial={{opacity:0,x:-20}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:index*0.12,duration:0.55}}
      style={{position:"relative",paddingBottom:"36px"}}>
      <div style={{position:"absolute",left:"-37px",top:"7px",width:"8px",height:"8px",borderRadius:"50%",
        background:C.bg,border:"1px solid rgba(0,220,180,0.45)",transition:"all 0.3s",cursor:"default"}}
        onMouseEnter={e=>{e.currentTarget.style.background=C.teal;e.currentTarget.style.boxShadow="0 0 10px rgba(0,220,180,0.8)";}}
        onMouseLeave={e=>{e.currentTarget.style.background=C.bg;e.currentTarget.style.boxShadow="none";}}/>
      <span style={{fontSize:"13px",color:C.accent,...MONO}}>{exp.period}</span>
      <h3 style={{...SYNE,color:C.heading,fontWeight:700,marginTop:"5px",fontSize:"20px",lineHeight:1.25}}>{exp.role}</h3>
      <p style={{color:C.teal,opacity:0.7,fontSize:"14px",marginBottom:"10px",...MONO,marginTop:"3px"}}>{exp.company}</p>
      <p style={{color:C.body,fontSize:"15px",lineHeight:1.8}}>{exp.desc}</p>
    </motion.div>
  );
}

// ─── FORM FIELD ──────────────────────────────────────────────────────────────
function Field({label,type="text",placeholder,rows, name}) {
  const base = {
    width:"100%",background:"rgba(0,220,180,0.03)",border:"1px solid rgba(0,220,180,0.16)",
    color:C.heading,fontSize:"15px",padding:"14px 16px",outline:"none",
    ...MONO,transition:"border-color 0.25s",borderRadius:"4px",
  };
  const events = {
    onFocus:e=>e.target.style.borderColor="rgba(0,220,180,0.55)",
    onBlur:e=>e.target.style.borderColor="rgba(0,220,180,0.16)",
  };
  return (
    <div>
      <label style={{display:"block",fontSize:"12px",letterSpacing:"0.16em",textTransform:"uppercase",
        ...MONO,color:"rgba(0,220,180,0.5)",marginBottom:"9px"}}>{label}</label>
      {rows
        ? <textarea name={name} rows={rows} placeholder={placeholder} style={{...base,resize:"vertical",lineHeight:1.65}} {...events}/>
        : <input name={name} type={type} placeholder={placeholder} style={base} {...events}/>}
    </div>
  );
}

// ─── GHOST BUTTON ────────────────────────────────────────────────────────────
function GhostBtn({children,href="#"}) {
  return (
    <a href={href} style={{display:"inline-block",fontSize:"14px",border:"1px solid rgba(0,220,180,0.28)",
      color:C.accent,padding:"11px 24px",textDecoration:"none",...MONO,letterSpacing:"0.08em",
      transition:"all 0.25s",borderRadius:"4px"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.color=C.teal;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,220,180,0.28)";e.currentTarget.style.color=C.accent;}}>
      {children}
    </a>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const {scrollYProgress} = useScroll();
  const progressWidth = useTransform(scrollYProgress,[0,1],["0%","100%"]);
  const heroRef    = useRef(null);
  const heroInView = useInView(heroRef,{once:true});

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:#040b0a; }
        ::-webkit-scrollbar-thumb { background:#00dc96; border-radius:2px; }
        ::placeholder { color:rgba(0,220,180,0.18); }
        body::after {
          content:''; position:fixed; inset:0; pointer-events:none; z-index:1000;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity:0.35;
        }
      `}</style>

      <div style={{background:C.bg,color:C.heading,...MONO,minHeight:"100vh",position:"relative"}}>

        <SpiralCanvas/>
        <StickyOrb/>

        {/* Progress bar */}
        <motion.div style={{position:"fixed",top:0,left:0,height:"2px",background:C.teal,
          zIndex:50,width:progressWidth,boxShadow:`0 0 6px ${C.teal}`}}/>

        {/* ── LEFT SIDEBAR NAV ─────────────────────────────────
            64px wide. Links displayed vertically, readable size, good contrast.        */}
        <nav style={{
          position:"fixed",left:0,top:0,height:"100%",width:`${SIDEBAR}px`,zIndex:40,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          gap:"32px",
          borderRight:`1px solid ${C.border}`,
          background:"rgba(5,12,11,0.75)",backdropFilter:"blur(10px)",
        }}>
          {["Home","Projects","Experience","About","Contact"].map((link,i)=>(
            <motion.a key={link} href={`#${link.toLowerCase()}`}
              initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:0.5+i*0.07}}
              style={{
                writingMode:"vertical-rl",
                transform:"rotate(180deg)",
                ...MONO,
                fontSize:"11px",           // vertical text — 11px reads fine in this orientation
                fontWeight:500,
                letterSpacing:"0.18em",
                textTransform:"uppercase",
                color:"rgba(0,220,180,0.55)",
                textDecoration:"none",
                transition:"color 0.25s, opacity 0.25s",
                lineHeight:1,
              }}
              onMouseEnter={e=>e.currentTarget.style.color=C.teal}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(0,220,180,0.55)"}
            >{link}</motion.a>
          ))}
          {/* Decorative line below links */}
          <motion.div initial={{scaleY:0}} animate={{scaleY:1}} transition={{delay:1.2,duration:0.8}}
            style={{width:"1px",height:"40px",background:"rgba(0,220,180,0.2)"}}/>
        </nav>

        {/* ── LOGO ─────────────────────────────────────────── */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}
          style={{position:"fixed",top:"22px",left:`${SIDEBAR+16}px`,zIndex:40}}>
          <span style={{...SYNE,fontSize:"24px",fontWeight:900,color:C.teal,
            textShadow:"0 0 24px rgba(0,220,180,0.5)"}}>
            B<span style={{color:C.heading}}>.</span>
          </span>
        </motion.div>

        {/* ── TOP-RIGHT NAV ────────────────────────────────── */}
        <motion.header initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
          style={{position:"fixed",top:0,right:0,zIndex:40,padding:"18px 28px",
            display:"flex",alignItems:"center",gap:"24px"}}>
          {["Projects","About"].map(link=>(
            <a key={link} href={`#${link.toLowerCase()}`}
              style={{fontSize:"14px",color:"rgba(0,220,180,0.6)",textDecoration:"none",...MONO,
                letterSpacing:"0.06em",transition:"color 0.25s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.teal}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(0,220,180,0.6)"}
            >{link}</a>
          ))}
          <a href="#contact"
            style={{fontSize:"14px",border:`1px solid ${C.tealMid}`,color:C.teal,padding:"9px 20px",
              textDecoration:"none",letterSpacing:"0.07em",...MONO,transition:"all 0.25s",borderRadius:"4px"}}
            onMouseEnter={e=>{e.currentTarget.style.background=C.teal;e.currentTarget.style.color="#000";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.teal;}}
          >Contact</a>
        </motion.header>

        {/* ── RIGHT SOCIALS ────────────────────────────────── */}
        <div style={{position:"fixed",right:"18px",top:"50%",transform:"translateY(-50%)",zIndex:40,
          display:"flex",flexDirection:"column",gap:"20px",alignItems:"center"}}>
          {[["GH","#"],["LI","#"],["TW","#"]].map(([s,href],i)=>(
            <motion.a key={s} href={href} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:0.9+i*0.08}}
              style={{fontSize:"11px",color:"rgba(0,220,180,0.4)",textDecoration:"none",...MONO,
                fontWeight:500,letterSpacing:"0.08em",transition:"color 0.25s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.teal}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(0,220,180,0.4)"}
            >{s}</motion.a>
          ))}
        </div>

        {/* ══════════════════════ HERO ═══════════════════════ */}
        <section id="home" ref={heroRef} style={{
          ...SEC, minHeight:"100vh",
          display:"flex", alignItems:"center",
          paddingTop:0, paddingBottom:0,
        }}>
          <div style={{width:"100%",maxWidth:`${CONTENT_MAX}px`}}>

            <motion.p initial={{opacity:0,y:10}} animate={heroInView?{opacity:1,y:0}:{}} transition={{delay:0.35}}
              style={{color:C.accent,fontSize:"13px",letterSpacing:"0.22em",textTransform:"uppercase",
                marginBottom:"20px",...MONO}}>
              // Bunbee
            </motion.p>

            {["Developer","Architect","Engineer"].map((word,i)=>(
              <motion.h1 key={word}
                initial={{opacity:0,x:-56}} animate={heroInView?{opacity:1,x:0}:{}}
                transition={{delay:0.45+i*0.12,duration:0.85,ease:[0.16,1,0.3,1]}}
                style={{...SYNE,letterSpacing:"-0.03em",lineHeight:1.05,fontWeight:900,
                  ...(i===0?{fontSize:"clamp(48px,6vw,76px)",color:C.teal,textShadow:"0 0 28px rgba(0,220,180,0.45)"}
                    :i===1?{fontSize:"clamp(36px,4.8vw,58px)",color:"rgba(0,200,160,0.5)"}
                    :{fontSize:"clamp(26px,3.8vw,46px)",color:"rgba(0,180,140,0.24)"}),
                }}>{word}</motion.h1>
            ))}

            <motion.p initial={{opacity:0,y:12}} animate={heroInView?{opacity:1,y:0}:{}} transition={{delay:0.9}}
              style={{color:"#4a8070",fontSize:"16px",lineHeight:1.8,marginTop:"24px",maxWidth:"400px"}}>
              Seasoned engineer who thinks in systems and ships in pixels. 8+ years experience crafting performant, beautiful products from kernel to canvas.
            </motion.p>

            <motion.div initial={{opacity:0,y:10}} animate={heroInView?{opacity:1,y:0}:{}} transition={{delay:1.1}}
              style={{display:"flex",gap:"14px",marginTop:"32px",flexWrap:"wrap"}}>
              {[["View Work","#projects","filled"],["Let's Talk","#contact","ghost"]].map(([label,href,type])=>(
                <a key={label} href={href} style={{
                  fontSize:"14px",fontWeight:type==="filled"?700:500,padding:"13px 28px",
                  textDecoration:"none",letterSpacing:"0.06em",...MONO,transition:"all 0.25s",borderRadius:"4px",
                  ...(type==="filled"?{background:C.teal,color:"#000"}:{border:`1px solid ${C.tealMid}`,color:C.teal,background:"transparent"}),
                }}
                  onMouseEnter={e=>e.currentTarget.style.background=type==="filled"?"#00ffb3":"rgba(0,220,180,0.07)"}
                  onMouseLeave={e=>e.currentTarget.style.background=type==="filled"?C.teal:"transparent"}
                >{label}</a>
              ))}
            </motion.div>

            <motion.div initial={{opacity:0}} animate={heroInView?{opacity:1}:{}} transition={{delay:1.35}}
              style={{marginTop:"52px",maxWidth:"360px"}}>
              {SKILLS.map((s,i)=><SkillBar key={s.name} name={s.name} pct={s.pct} delay={1.4+i*0.08}/>)}
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.2}}
            style={{position:"absolute",bottom:"40px",left:`${CONTENT_L}px`,
              display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}>
            <motion.div animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:2,ease:"easeInOut"}}
              style={{width:"1px",height:"44px",background:"linear-gradient(to bottom,#00dc96,transparent)"}}/>
            <span style={{fontSize:"10px",color:"rgba(0,220,180,0.3)",writingMode:"vertical-rl",
              letterSpacing:"0.18em",...MONO}}>scroll</span>
          </motion.div>
        </section>

        {/* ══════════════════ PROJECTS ═══════════════════════ */}
        <section id="projects" style={SEC}>
          <div style={{maxWidth:`${CONTENT_MAX}px`}}>
            <SectionHeader title="Projects"/>
            {PROJECTS.map((p,i)=><ProjectCard key={p.id} project={p} index={i}/>)}
            <div onClick={() => window.open('https://www.linkedin.com/in/bunbee/', '_blank')} style={{marginTop:"8px"}}><GhostBtn>View All Projects →</GhostBtn></div>
          </div>
        </section>

        {/* ══════════════════ EXPERIENCE ═════════════════════ */}
        <section id="experience" style={SEC}>
          <div style={{maxWidth:`${CONTENT_MAX}px`}}>
            <SectionHeader title="Experience"/>
            <div style={{borderLeft:`1px solid ${C.border}`,paddingLeft:"32px"}}>
              {EXPERIENCE.map((exp,i)=><ExperienceItem key={i} exp={exp} index={i}/>)}
            </div>
          </div>
        </section>

        {/* ══════════════════ ABOUT ══════════════════════════ */}
        <section id="about" style={SEC}>
          <div style={{maxWidth:`${CONTENT_MAX}px`}}>
            <SectionHeader title="About"/>

            <motion.p initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              style={{color:C.body,fontSize:"16px",lineHeight:1.85,marginBottom:"48px"}}>
              I'm a seasoned engineer with 8+ years shipping production systems from distributed
              backends to pixel-perfect interfaces. I believe great software is equally rigorous and
              beautiful, and I thrive at the intersection of engineering and design thinking.
            </motion.p>

            {/* Education */}
            <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.08}}
              style={{marginBottom:"48px"}}>
              <p style={{fontSize:"12px",letterSpacing:"0.18em",textTransform:"uppercase",...MONO,
                color:"rgba(0,220,180,0.45)",marginBottom:"24px"}}>Education</p>
              {EDUCATION.map((e,i)=>(
                <div key={i} style={{marginBottom:"24px",paddingBottom:"24px",
                  borderBottom:i<EDUCATION.length-1?`1px solid ${C.border}`:"none"}}>
                  <p style={{color:"#00c898",fontSize:"16px",fontWeight:700,...SYNE}}>{e.school}</p>
                  <p style={{color:C.body,fontSize:"14px",marginTop:"6px",...MONO}}>{e.year} &nbsp;·&nbsp; {e.degree}</p>
                </div>
              ))}
              <div style={{marginTop:"8px"}}><GhostBtn>Full Resume →</GhostBtn></div>
            </motion.div>

            {/* Certifications */}
            <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.16}}>
              <p style={{fontSize:"12px",letterSpacing:"0.18em",textTransform:"uppercase",...MONO,
                color:"rgba(0,220,180,0.45)",marginBottom:"24px"}}>Certifications</p>
              {CERTS.map((c,i)=>(
                <div key={i} style={{marginBottom:"20px",paddingLeft:"18px",
                  borderLeft:`2px solid rgba(0,220,180,${i===0?0.5:0.16})`}}>
                  <p style={{color:C.heading,fontSize:"15px",fontWeight:600,...SYNE,lineHeight:1.4}}>{c.title}</p>
                  <p style={{color:C.accent,fontSize:"13px",...MONO,marginTop:"5px"}}>{c.date} &nbsp;·&nbsp; {c.org}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════ CONTACT ════════════════════════ */}
        <section id="contact" style={SEC}>
          <div style={{maxWidth:`${CONTENT_MAX}px`}}>
            <SectionHeader title="Contact"/>

            <motion.p initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              style={{color:C.body,fontSize:"16px",lineHeight:1.8,marginBottom:"40px"}}>
              Looking for a versatile senior engineer who cares as much about craft as performance?
              I'd love to hear about your project.
            </motion.p>

            <motion.form onSubmit={handleSubmit} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.1}}
              style={{display:"flex",flexDirection:"column",gap:"24px"}}>

              {/* Name + Email side-by-side */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
                <Field label="Name"  placeholder="Your Name"  name="name"       type="text"/>
                <Field label="Email" placeholder="Your email address" type="email" name="email"/>
              </div>

              <Field label="Message" name="message" placeholder="Tell me about your project…" rows={5}/>

              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                flexWrap:"wrap",gap:"16px",paddingTop:"4px"}}>
                <span style={{color:"rgba(0,220,180,0.28)",fontSize:"13px",...MONO}}>
                  or reach me at barnabmutinhiri@gmail.com
                </span>
                <motion.button type="submit" whileHover={{background:"#00ffb3"}}
                  style={{fontSize:"14px",background:C.teal,color:"#000",padding:"14px 36px",
                    border:"none",fontWeight:700,cursor:"pointer",...MONO,
                    letterSpacing:"0.1em",textTransform:"uppercase",
                    transition:"background 0.25s",borderRadius:"4px"}}>
                  Send Message →
                </motion.button>
              </div>

            </motion.form>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────── */}
        <footer style={{
          position:"relative",zIndex:3,
          padding:`24px 32px 24px ${CONTENT_L}px`,
          borderTop:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px",
        }}>
          <span style={{color:"rgba(0,220,180,0.22)",fontSize:"13px",...MONO}}>© 2024 Bunbee</span>
          <span style={{color:"rgba(0,220,180,0.22)",fontSize:"13px",...MONO}}>React · Framer Motion</span>
        </footer>

      </div>
    </>
  );
}