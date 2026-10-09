"use client";

import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const timecodeElRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const calloutsRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const navRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const navToggleRef = useRef<HTMLButtonElement>(null);
  const typewordRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // State for typewriter effect
  const [typewordIndex, setTypewordIndex] = useState(0);
  const [typewordCharIndex, setTypewordCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ["Narrative Editor", "Colorist", "Sound Designer", "Motion Artist"];

  // Header rotating designations (5 seconds interval with fade in & fade out)
  const designations = [
    "VIDEO EDITOR",
    "MOTION DESIGNER",
    "GRAPHIC DESIGNER",
    "VISUAL STORYTELLER",
  ];
  const [desigIndex, setDesigIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");

  // Header scroll & mobile states
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rotate designations under PAWAN SINGH NEGI every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState("out");
      setTimeout(() => {
        setDesigIndex((prev) => (prev + 1) % designations.length);
        setFadeState("in");
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, [designations.length]);

  // Header scroll detection (drops down from upside / fixed on scroll down)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // State for scroll progress and callouts
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [lastZone, setLastZone] = useState(-1);
  const [heroInView, setHeroInView] = useState(true);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check for reduced motion preference
    const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(reduceMotionMedia.matches);

    const updateReduceMotion = () => setReduceMotion(reduceMotionMedia.matches);
    reduceMotionMedia.addEventListener('change', updateReduceMotion);

    return () => reduceMotionMedia.removeEventListener('change', updateReduceMotion);
  }, []);

  useEffect(() => {
    // Hero canvas: procedural cinematic scroll-scrub
    if (!canvasRef.current || !heroSectionRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resizeCanvas = () => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("load", resizeCanvas);
    resizeCanvas();

    const hexToRgb = (hex: string) => {
      const v = parseInt(hex.slice(1), 16);
      return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
    };

    const CYAN = hexToRgb("#00d2ff");
    const COBALT = hexToRgb("#0252b4");
    const TEAL = hexToRgb("#2dd4bf");

    const lerpColor = (a: number[], b: number[], t: number) =>
      `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;

    const drawHero = (progress: number, t: number) => {
      if (W === 0 || H === 0) return;
      ctx.clearRect(0, 0, W, H);

      const phase = (Math.sin(progress * Math.PI * 1.4 + t * 0.00005) + 1) / 2;
      const angle = (20 + progress * 50) * (Math.PI / 180);
      const x1 = W / 2 - Math.cos(angle) * W;
      const y1 = H / 2 - Math.sin(angle) * H;
      const x2 = W / 2 + Math.cos(angle) * W;
      const y2 = H / 2 + Math.sin(angle) * H;
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, lerpColor(TEAL, CYAN, phase));
      grad.addColorStop(0.5, lerpColor(CYAN, COBALT, phase));
      grad.addColorStop(1, "#02040a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const rg = ctx.createRadialGradient(W / 2, H * 0.55, H * 0.12, W / 2, H * 0.55, H * 0.78);
      rg.addColorStop(0, "rgba(0,0,0,0)");
      rg.addColorStop(1, "rgba(2,6,18,0.65)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(W / 2, H * 0.46);
      ctx.rotate(t * 0.00006 + progress * 1.2);
      const baseR = Math.min(W, H) * 0.16;
      const maxR = Math.min(W, H) * 0.42;
      const irisR = baseR + (maxR - baseR) * progress;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(1, irisR - i * 18), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56,189,248,${0.25 - i * 0.05})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      const blades = 8;
      for (let b = 0; b < blades; b++) {
        const a = (b / blades) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * irisR * 0.55, Math.sin(a) * irisR * 0.55);
        ctx.lineTo(Math.cos(a) * irisR, Math.sin(a) * irisR);
        ctx.strokeStyle = "rgba(56,189,248,0.18)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      const streakX = -W * 0.3 + progress * W * 1.6;
      const lg = ctx.createLinearGradient(streakX - 140, 0, streakX + 140, H);
      lg.addColorStop(0, "rgba(56,189,248,0)");
      lg.addColorStop(0.5, "rgba(56,189,248,0.14)");
      lg.addColorStop(1, "rgba(56,189,248,0)");
      ctx.fillStyle = lg;
      ctx.save();
      ctx.translate(streakX, H / 2);
      ctx.rotate(-0.35);
      ctx.fillRect(-160, -H, 320, H * 2);
      ctx.restore();

      const bars = 56;
      const bw = W / bars;
      for (let j = 0; j < bars; j++) {
        const n = Math.sin(j * 0.5 + t * 0.0018) * Math.cos(j * 0.23 - t * 0.0011);
        const amp = (0.15 + 0.5 * Math.abs(n)) * (0.4 + 0.6 * progress);
        const bh = amp * H * 0.16;
        ctx.fillStyle = j % 2 === 0 ? "rgba(0,210,255,0.65)" : "rgba(45,212,191,0.65)";
        ctx.fillRect(j * bw + bw * 0.15, H - bh - H * 0.06, bw * 0.7, bh);
      }
    };

    const getProgress = () => {
      if (!heroSectionRef.current) return 0;
      const rect = heroSectionRef.current.getBoundingClientRect();
      const scrollable = heroSectionRef.current.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / scrollable));
    };

    const zones = [
      [0.1, 0.3],
      [0.35, 0.55],
      [0.6, 0.8],
    ];

    let smooth = 0;
    let lastZoneState = -1;
    let heroInViewState = true;

    if ("IntersectionObserver" in window && heroSectionRef.current) {
      const heroIO = new IntersectionObserver((entries) => {
        heroInViewState = entries[0].isIntersecting;
        setHeroInView(heroInViewState);
      }, { rootMargin: "200px 0px 200px 0px" });
      heroIO.observe(heroSectionRef.current);
    }

    let rafId = 0;
    const loop = (t: number) => {
      const raw = getProgress();
      smooth += (raw - smooth) * (reduceMotion ? 1 : 0.35);

      drawHero(smooth, t);

      const v = videoRef.current;
      if (heroInViewState && v && v.duration && !v.seeking) {
        const target = Math.round(smooth * v.duration * 24) / 24;
        if (Math.abs(v.currentTime - target) > 0.001) {
          v.currentTime = target;
        }
      }

      if (heroContentRef.current) {
        const op = Math.max(0, 1 - smooth / 0.08);
        heroContentRef.current.style.opacity = op.toFixed(3);
      }

      if (timecodeElRef.current) {
        const totalFrames = 42 * 24;
        const cf = Math.min(totalFrames - 1, Math.floor(smooth * totalFrames));
        const secs = Math.floor(cf / 24);
        const frs = cf % 24;
        const mm = String(Math.floor(secs / 60)).padStart(2, "0");
        const ss = String(secs % 60).padStart(2, "0");
        const ff = String(frs).padStart(2, "0");
        timecodeElRef.current.textContent = "REEL_02 · 00:" + mm + ":" + ss + ":" + ff;
      }

      let zoneIdx = -1;
      for (let z = 0; z < zones.length; z++) {
        if (smooth >= zones[z][0] && smooth <= zones[z][1]) {
          zoneIdx = z;
          break;
        }
      }

      if (zoneIdx !== lastZoneState) {
        calloutsRefs.current.forEach((c, i) => {
          if (c) c.classList.toggle("visible", i === zoneIdx);
        });
        setLastZone(zoneIdx);
        lastZoneState = zoneIdx;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("load", resizeCanvas);
    };
  }, [reduceMotion]);

  useEffect(() => {
    // Typewriter effect
    if (!typewordRef.current) return;

    if (reduceMotion){
      typewordRef.current.textContent = words[0];
      return;
    }

    let wordIdx = typewordIndex;
    let charIdx = typewordCharIndex;
    let deleting = isDeleting;

    typewordRef.current.textContent = words[wordIdx].slice(0, charIdx);

    const step = () => {
      if (!typewordRef.current) return;
      const word = words[wordIdx];
      if (!deleting){
        if (charIdx < word.length){
          charIdx++;
          setTypewordCharIndex(charIdx);
          typewordRef.current.textContent = word.slice(0, charIdx);
          setTimeout(step, 55);
        } else {
          setIsDeleting(true);
          setTimeout(step, 1800);
        }
      } else {
        if (charIdx > 0){
          charIdx--;
          setTypewordCharIndex(charIdx);
          typewordRef.current.textContent = word.slice(0, charIdx);
          setTimeout(step, 30);
        } else {
          setIsDeleting(false);
          setTypewordIndex((wordIdx + 1) % words.length);
          setTimeout(step, 250);
        }
      }
    };

    setTimeout(() => setIsDeleting(true), 1800);
    setTimeout(step, 1800);

    return () => {
      // Cleanup timeouts if needed
    };
  }, [reduceMotion]);


  useEffect(() => {
    // Section-head reveal
    if ('IntersectionObserver' in window){
      const revealIO = new IntersectionObserver((entries)=>{
        entries.forEach((e: any)=>{
          if (e.isIntersecting){
            e.target.classList.add('in-view');
            revealIO.unobserve(e.target);
          }
        });
      }, { threshold:0.2, rootMargin:'0px 0px -80px 0px' });
      document.querySelectorAll('.section-head').forEach((el: any)=> revealIO.observe(el));

      const processIO = new IntersectionObserver((entries)=>{
        entries.forEach((e: any)=> e.target.classList.toggle('in-view', e.isIntersecting));
      }, { threshold:0.2 });
      const processSection = document.getElementById('process');
      if (processSection) processIO.observe(processSection);
    } else {
      document.querySelectorAll('.section-head').forEach((el: any)=> el.classList.add('in-view'));
    }
  }, []);

  return (
    <>
      {/* Grain overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-5 mix-blend-overlay"
        aria-hidden="true"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '180px 180px'
        }}
      ></div>

      {/* Nav: Bigger header, fixed at top, slides down from upside when scrolling down */}
      <nav
  ref={navRef}
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    isScrolled
      ? "py-4 sm:py-5 bg-[rgba(2,5,14,0.92)] backdrop-blur-[24px] backdrop-saturate-[160%] border-b border-[rgba(56,189,248,0.2)] shadow-[0_16px_36px_-8px_rgba(0,0,0,0.9),0_0_24px_-4px_rgba(0,210,255,0.2)] translate-y-0"
      : "py-6 sm:py-7 bg-gradient-to-b from-[rgba(2,5,14,0.85)] to-transparent border-b border-transparent translate-y-0"
  }`}
>
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 flex items-center justify-between relative">
          {/* Brand: PAWAN SINGH NEGI in Capital with rotating designations */}
          <a
            href="#top"
            className="flex flex-col items-start leading-[1.05] no-underline group"
          >
            <span className="font-display font-extrabold text-[1.45rem] sm:text-[1.8rem] tracking-wider text-foreground uppercase transition-colors duration-200 group-hover:text-[#00d2ff]">
              PAWAN SINGH NEGI
            </span>
            <div className="h-[20px] sm:h-[22px] overflow-hidden flex items-center mt-1">
              <span
                key={desigIndex}
                className={`font-body font-semibold text-[0.72rem] sm:text-[0.8rem] tracking-[0.18em] text-[#00d2ff] uppercase transition-all duration-500 ease-in-out ${
                  fadeState === "in"
                    ? "opacity-100 translate-y-0 filter-none"
                    : "opacity-0 -translate-y-2 blur-[2px]"
                }`}
              >
                {designations[desigIndex]}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div
            ref={navLinksRef}
            className="items-center gap-x-8 lg:gap-x-11 hidden sm:flex"
          >
            <a
              href="#work"
              className="text-mist text-[1rem] font-medium tracking-wide hover:text-[#00d2ff] transition-colors duration-200"
            >
              Work
            </a>
            <a
              href="#toolkit"
              className="text-mist text-[1rem] font-medium tracking-wide hover:text-[#00d2ff] transition-colors duration-200"
            >
              Toolkit
            </a>
            <a
              href="#process"
              className="text-mist text-[1rem] font-medium tracking-wide hover:text-[#00d2ff] transition-colors duration-200"
            >
              Process
            </a>
            <a
              href="#faq"
              className="text-mist text-[1rem] font-medium tracking-wide hover:text-[#00d2ff] transition-colors duration-200"
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="border border-[#00d2ff] text-[#00d2ff] hover:bg-[#00d2ff] hover:text-[#02040a] shadow-[0_0_16px_rgba(0,210,255,0.25)] hover:shadow-[0_0_24px_rgba(0,210,255,0.55)] px-6 py-2.5 rounded-full transition-all duration-250 font-semibold text-[0.98rem]"
            >
              Let's talk
            </a>
          </div>

          {/* Mobile nav toggle */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col justify-between w-[24px] h-[17px] bg-none border-none cursor-pointer p-0"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className={`h-[2px] w-full bg-foreground rounded transition-transform duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""}`}></span>
              <span className={`h-[2px] w-full bg-foreground rounded transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
              <span className={`h-[2px] w-full bg-foreground rounded transition-transform duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`fixed inset-x-0 top-full bg-[rgba(2,5,14,0.98)] backdrop-blur-[24px] flex flex-col items-start gap-0 px-6 sm:px-8 pb-5 border-b border-[rgba(56,189,248,0.16)] transition-all duration-250 sm:hidden ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <a
            href="#work"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-[1rem] border-b border-[rgba(56,189,248,0.08)] py-4 text-mist hover:text-[#00d2ff]"
          >
            Work
          </a>
          <a
            href="#toolkit"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-[1rem] border-b border-[rgba(56,189,248,0.08)] py-4 text-mist hover:text-[#00d2ff]"
          >
            Toolkit
          </a>
          <a
            href="#process"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-[1rem] border-b border-[rgba(56,189,248,0.08)] py-4 text-mist hover:text-[#00d2ff]"
          >
            Process
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-[1rem] border-b border-[rgba(56,189,248,0.08)] py-4 text-mist hover:text-[#00d2ff]"
          >
            FAQ
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center text-[1rem] font-semibold border-b border-[rgba(56,189,248,0.08)] py-4 mt-3 text-[#00d2ff]"
          >
            Let's talk
          </a>
        </div>
      </nav>

      {/*       {/* Hero Section */}
      <section
        ref={heroSectionRef}
        className="relative h-[400vh] sm:h-[350vh] md:h-[300vh] bg-[#02040a]"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <video
            ref={videoRef}
            src="/hero-scroll-light.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-contain md:object-cover md:object-center"
            aria-hidden="true"
          />
          <canvas ref={canvasRef} className="hidden" aria-hidden="true"></canvas>
          {/* <div className="absolute inset-0 bg-[#02040a]/40 z-[1]"></div> */}
          {/* <div className="absolute left-0 right-0 h-[10%] bg-gradient-to-b from-[#02040a] to-transparent z-[2]"></div> */}
          <div className="absolute left-0 right-0 h-[10%] bg-gradient-to-t from-[#02040a] to-transparent z-[2] bottom-0"></div>

          <div
            ref={heroContentRef}
            className="absolute inset-0 z-[3] flex flex-col items-start justify-center px-[8%] pointer-events-none"
          >
            <div
              ref={timecodeElRef}
              className="font-mono-custom text-[0.8rem] tracking-wider text-[rgba(56,189,248,0.7)] mb-[1.5rem]"
            >
              REEL_02 · 00:00:00:00
            </div> 
            <h1 className="font-display font-bold text-[clamp(2.6rem,8vw,6.5rem)] leading-[0.98] tracking-tighter text-foreground max-w-[14ch] mb-0">
              Every cut has<br/>a reason.
            </h1>
            <p className="font-body text-[clamp(1rem,2vw,1.25rem)] text-mist mt-[1.5rem]">
              Pawan Singh Negi —
              <span ref={typewordRef} className="text-foreground font-semibold"></span>
              <span className="inline-block ml-[2px] text-[#00d2ff] animate-blink font-bold">_</span>
            </p>
            <div className="absolute bottom-[8%] left-[8%] flex items-center gap-[10px] text-[0.72rem] tracking-wider text-mist uppercase">
              <span className="w-[1px] h-[28px] bg-[linear-gradient(to_top,var(--mist),transparent)] animate-[scrollpulse_1.6s_ease-in-out_infinite]"></span>
              Scroll
            </div>
          </div>

          {/* Hero Callouts */}
          <div className="absolute inset-0 z-[3] pointer-events-none">
            <div
              ref={(el) => { calloutsRefs.current[0] = el; }}
              className="absolute max-w-[270px] p-[16px] rounded-[16px] bg-[rgba(4,12,28,0.65)] border border-[rgba(56,189,248,0.18)] backdrop-blur-[14px] opacity-0 translate-y-[16px] transition-[opacity,transform] duration-400 top-[20%] left-[8%] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              <p className="text-[0.95rem] text-foreground">Narrative editing that holds attention</p>
            </div>
            <div
              ref={(el) => { calloutsRefs.current[1] = el; }}
              className="absolute max-w-[270px] p-[16px] rounded-[16px] bg-[rgba(4,12,28,0.65)] border border-[rgba(56,189,248,0.18)] backdrop-blur-[14px] opacity-0 translate-y-[16px] transition-[opacity,transform] duration-400 top-[44%] right-[8%] text-right shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              <p className="text-[0.95rem] text-foreground">Color grades that set the mood</p>
            </div>
            <div
              ref={(el) => { calloutsRefs.current[2] = el; }}
              className="absolute max-w-[270px] p-[16px] rounded-[16px] bg-[rgba(4,12,28,0.65)] border border-[rgba(56,189,248,0.18)] backdrop-blur-[14px] opacity-0 translate-y-[16px] transition-[opacity,transform] duration-400 bottom-[16%] left-[8%] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              <p className="text-[0.95rem] text-foreground">Sound design that completes the story</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}