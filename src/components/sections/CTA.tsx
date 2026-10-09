"use client";

import { useEffect, useRef } from "react";
export default function CTA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Floating particles
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 600,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,210,255,${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{ padding: "clamp(7rem, 14vw, 12rem) 0" }}
    >
      {/* Multi-layer ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Central radial burst */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,210,255,0.14) 0%, rgba(2,132,199,0.10) 35%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Edge left teal */}
        <div
          className="absolute -left-[10%] top-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(45,212,191,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Edge right cobalt */}
        <div
          className="absolute -right-[10%] top-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(2,101,210,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.5 }}
          aria-hidden="true"
        />
      </div>

      {/* Horizontal rule line with fade */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[900px] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(56,189,248,0.3) 30%, rgba(56,189,248,0.5) 50%, rgba(56,189,248,0.3) 70%, transparent)",
        }}
      />

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-[860px] mx-auto">

          {/* Availability badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(45,212,191,0.35)] bg-[rgba(45,212,191,0.08)] mb-8"
            style={{ animation: "badge-float 3s ease-in-out infinite" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.8)] animate-pulse" />
            <span className="font-mono-custom text-[0.75rem] tracking-[0.12em] text-[#2dd4bf] uppercase">
              Available for new projects
            </span>
          </div>

          {/* Headline */}
          <h2
            className="font-display font-extrabold leading-[0.95] tracking-tighter text-foreground mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            Got footage?
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00d2ff 0%, #2dd4bf 60%, #0284c7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Let&apos;s find the cut.
            </span>
          </h2>

          <p className="font-body text-mist text-[1.05rem] leading-relaxed max-w-[44ch] mb-10">
            Drop a line with a brief on your project — raw footage, locked edit, or
            just an idea — and I&apos;ll come back with a plan.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a
              href="mailto:negipawansingh02@gmail.com"
              id="cta-email-btn"
              className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #00d2ff, #0284c7)",
                color: "#02040a",
                boxShadow: "0 8px 30px -6px rgba(0,210,255,0.55), 0 0 0 1px rgba(0,210,255,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 16px 40px -6px rgba(0,210,255,0.7), 0 0 0 1px rgba(0,210,255,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 8px 30px -6px rgba(0,210,255,0.55), 0 0 0 1px rgba(0,210,255,0.2)";
              }}
            >
              <span>Start a project</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@pawansinghnegi6948"
              target="_blank"
              rel="noopener noreferrer"
              id="cta-youtube-btn"
              className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full border border-[rgba(56,189,248,0.3)] text-[#00d2ff] transition-all duration-300 hover:border-[rgba(56,189,248,0.6)] hover:bg-[rgba(0,210,255,0.07)]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="flex-none">
                <path d="M13.8 4.2a1.7 1.7 0 00-1.2-1.2C11.5 2.8 8 2.8 8 2.8s-3.5 0-4.6.2A1.7 1.7 0 002.2 4.2C2 5.3 2 8 2 8s0 2.7.2 3.8a1.7 1.7 0 001.2 1.2C4.5 13.2 8 13.2 8 13.2s3.5 0 4.6-.2a1.7 1.7 0 001.2-1.2C14 10.7 14 8 14 8s0-2.7-.2-3.8zM6.8 10.4V5.6L10.6 8l-3.8 2.4z"/>
              </svg>
              View work
            </a>
          </div>

          {/* Meta / social row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono-custom text-[0.78rem] tracking-wider text-mist">
            <span>negipawansingh02@gmail.com</span>
            <span className="hidden sm:inline text-[rgba(56,189,248,0.3)]">·</span>
            <span>Got a story? Let's bring it to life</span>
            <span className="hidden sm:inline text-[rgb(247, 250, 250)]">·</span>
            <a
  href="https://wa.me/919084470395?text=Hey"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center rounded-full bg-[#25D366] px-6 py-3 font-semibold text-red"
>
  Chat on WhatsApp
</a>
          </div>
        </div>
      </div>

      {/* Bottom fade-in line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] max-w-[700px] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(56,189,248,0.2) 50%, transparent)",
        }}
      />
    </section>
  );
}