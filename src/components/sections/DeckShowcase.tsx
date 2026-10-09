"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ------------------------------------------------------------------ */
/*  EDIT THIS PART: your designs and text                              */
/*  Put images in public/designs/ and list them here.                  */
/*  src starts with /designs/ (do not write "public").                 */
/* ------------------------------------------------------------------ */
type Design = { src: string; title: string; tag: string };

const DESIGNS: Design[] = [
  { src: "/designs/1.png", title: "Brand poster", tag: "Poster" },
  { src: "/designs/3.png", title: "Social media post", tag: "Social" },
  { src: "/designs/2.png", title: "Logo and identity", tag: "Branding" },
  { src: "/designs/5.png", title: "YouTube thumbnail", tag: "Thumbnail" },
  { src: "/designs/4.png", title: "Event flyer", tag: "Print" },
  { src: "/designs/6.png", title: "Packaging mockup", tag: "Packaging" },
  { src: "/designs/7.png", title: "Brand poster", tag: "Poster" },
  { src: "/designs/8.png", title: "Social media post", tag: "Social" },
  { src: "/designs/9.png", title: "Logo and identity", tag: "Branding" },
  { src: "/designs/16.png", title: "YouTube thumbnail", tag: "Thumbnail" },
  { src: "/designs/21.png", title: "Event flyer", tag: "Print" },
  { src: "/designs/28.jpeg.png", title: "Packaging mockup", tag: "Packaging" },
  { src: "/designs/The K Tiffin - 1.png", title: "Brand poster", tag: "Poster" },
  { src: "/designs/Unique Teaching Methods - 1.png", title: "Social media post", tag: "Social" },
  { src: "/designs/27.png", title: "Logo and identity", tag: "Branding" },
  { src: "/designs/30.png", title: "YouTube thumbnail", tag: "Thumbnail" },
  { src: "/designs/Miss Uttarakhand Banner_Size.png", title: "Event flyer", tag: "Print" },
  { src: "/designs/Graphic designer  Video editor  Photo editor (1).png", title: "Packaging mockup", tag: "Packaging" }
];
const EYEBROW = "Graphic design";
const HEADING = "Pick a card.";
const SUBHEAD =
  "A stack of my design work. Click the deck, drag the top card away, or use the arrows.";
/* ------------------------------------------------------------------ */

const FLICK_MS = 420;
const DRAG_THRESHOLD = 80;
const DOUBLE_CLICK_MS = 260;

export default function DeckShowcase() {
  const n = DESIGNS.length;
  const [order, setOrder] = useState<number[]>(() => DESIGNS.map((_, i) => i));
  const [leaving, setLeaving] = useState(0); // -1 left, 1 right, 0 none
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  // width / height of each image once loaded, so every card takes its image's own shape
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const noteSize = (idx: number, img: HTMLImageElement | null) => {
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    const r = img.naturalWidth / img.naturalHeight;
    setRatios((m) => (Math.abs((m[idx] ?? 0) - r) < 0.001 ? m : { ...m, [idx]: r }));
  };
  const start = useRef(0);
  const moved = useRef(false);
  const [justLeft, setJustLeft] = useState<number | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [open, setOpen] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timer2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (timer2.current) clearTimeout(timer2.current);
    if (clickTimer.current) clearTimeout(clickTimer.current);
  }, []);

  const flick = useCallback(
    (dir: number) => {
      if (leaving || n < 2) return;
      setLeaving(dir);
      const gone = order[0];
      timer.current = setTimeout(() => {
        setJustLeft(gone);
        setOrder((o) => [...o.slice(1), o[0]]);
        setLeaving(0);
        setDx(0);
        timer2.current = setTimeout(() => setJustLeft(null), 80);
      }, FLICK_MS);
    },
    [leaving, n, order]
  );

  const step = useCallback(
    (dir: number) => {
      if (n < 2) return;
      setOrder((o) => (dir > 0 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)]));
    },
    [n]
  );

  // keep the latest flick for the delayed single-click
  const flickRef = useRef(flick);
  flickRef.current = flick;

  // big preview: Esc closes, arrows move, page scroll locked while open
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  const back = useCallback(() => {
    if (leaving || n < 2) return;
    setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  }, [leaving, n]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") flick(1);
    if (e.key === "ArrowLeft") back();
    if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "f") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (leaving) return;
    const r = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() });
    start.current = e.clientX;
    moved.current = false;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const d = e.clientX - start.current;
    if (Math.abs(d) > 6) moved.current = true;
    setDx(d);
  };
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (!moved.current) {
      setDx(0);
      if (clickTimer.current) {
        // second click inside the window: open the big preview instead of flicking
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
        setOpen(true);
      } else {
        clickTimer.current = setTimeout(() => {
          clickTimer.current = null;
          flickRef.current(1);
        }, DOUBLE_CLICK_MS);
      }
    } else if (Math.abs(dx) > DRAG_THRESHOLD) {
      flick(dx > 0 ? 1 : -1);
    } else {
      setDx(0);
    }
  };

  const top = DESIGNS[order[0]];

  return (
    <section id="designs" className="dk-sec" aria-label="Graphic design work">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="dk-head">
        <p className="dk-eyebrow">{EYEBROW}</p>
        <h2 className="dk-h">{HEADING}</h2>
        <p className="dk-sub">{SUBHEAD}</p>
      </div>

      <div
        className="dk-deck"
        tabIndex={0}
        onKeyDown={onKey}
        aria-roledescription="carousel"
        aria-label="Design cards. Left and right arrows to browse, Enter to enlarge."
      >
        {order.map((idx, k) => {
          const d = DESIGNS[idx];
          const isTop = k === 0;
          const ratio = ratios[idx] ?? 0.8;
          let transform = `translate3d(0,${k * 14}px,${-k * 30}px) scale(${1 - k * 0.05}) rotate(${
            (k % 2 ? 1 : -1) * k * 1.6
          }deg)`;
          let opacity = k > 4 ? 0 : 1;
          let transition: string | undefined;
          if (isTop && leaving) {
            transform = `translate3d(${leaving * 120}%,-20px,40px) rotate(${leaving * 18}deg)`;
            opacity = 0;
          } else if (isTop && dragging) {
            const still = Math.abs(dx) < 6;
            transform = `translate3d(${dx}px,0,0) rotate(${dx / 14}deg) scale(${still ? 0.95 : 1})`;
            transition = still ? "transform .12s ease-out" : "none";
          } else if (k === 1 && leaving) {
            // the next card swings out to the opposite side while the top one leaves
            transform = `translate3d(${-leaving * 34}%,6px,-10px) rotate(${-leaving * 7}deg)`;
          }
          if (idx === justLeft) transition = "none";
          return (
            <div
              key={idx}
              className={isTop ? "dk-card dk-top" : "dk-card"}
              style={{
                zIndex: n - k,
                transform,
                opacity,
                transition,
                width: `min(var(--dk-w), calc(var(--dk-h) * ${ratio}))`,
                height: `min(var(--dk-h), calc(var(--dk-w) / ${ratio}))`,
              }}
              onPointerDown={isTop ? onDown : undefined}
              onPointerMove={isTop ? onMove : undefined}
              onPointerUp={isTop ? onUp : undefined}
              onPointerCancel={isTop ? onUp : undefined}
              aria-hidden={!isTop}
            >
              <div className="dk-inner">
                {failed[idx] ? (
                  <div className="dk-ph">
                    <b>Add your design here</b>
                    <span>public{d.src}</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={d.src}
                    alt={d.title}
                    draggable={false}
                    ref={(el) => noteSize(idx, el)}
                    onLoad={(e) => noteSize(idx, e.currentTarget)}
                    onError={() => setFailed((f) => ({ ...f, [idx]: true }))}
                  />
                )}
                {isTop && ripple && (
                  <span key={ripple.id} className="dk-rip" style={{ left: ripple.x, top: ripple.y }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="dk-meta" aria-live="polite">
        <span className="dk-tag">{top.tag}</span>
        <span className="dk-title">{top.title}</span>
        <span className="dk-count">
          {String(DESIGNS.indexOf(top) + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
      </div>

      <p className="dk-hint">Double-click a card or press Enter to enlarge. Esc to close.</p>

      <div className="dk-ctl">
        <button type="button" onClick={back} aria-label="Previous design">
          Back
        </button>
        <button type="button" onClick={() => setOpen(true)} aria-label="Enlarge this design">
          Enlarge
        </button>
        <button type="button" onClick={() => flick(1)} aria-label="Next design">
          Next
        </button>
      </div>
      {open &&
        createPortal(
          <div
            className="dk-lb"
            role="dialog"
            aria-modal="true"
            aria-label={top.title}
            data-lenis-prevent
            onClick={() => setOpen(false)}
          >
            <style dangerouslySetInnerHTML={{ __html: CSS }} />
            <button
              type="button"
              className="dk-lb-x"
              aria-label="Close preview"
              autoFocus
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="dk-lb-nav dk-lb-prev"
              aria-label="Previous design"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
            >
              &lsaquo;
            </button>
            <figure className="dk-lb-fig" onClick={(e) => e.stopPropagation()}>
              {failed[order[0]] ? (
                <div className="dk-ph dk-lb-ph">
                  <b>Add your design here</b>
                  <span>public{top.src}</span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={order[0]} src={top.src} alt={top.title} className="dk-lb-img" />
              )}
              <figcaption>
                <span className="dk-tag">{top.tag}</span> {top.title}
              </figcaption>
            </figure>
            <button
              type="button"
              className="dk-lb-nav dk-lb-next"
              aria-label="Next design"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
            >
              &rsaquo;
            </button>
          </div>,
          document.body
        )}
    </section>
  );
}

const CSS = `
.dk-sec{position:relative;padding:clamp(64px,10vw,120px) 16px;display:flex;flex-direction:column;align-items:center;gap:28px;overflow:hidden}
.dk-head{text-align:center;max-width:560px;display:grid;gap:10px}
.dk-eyebrow{margin:0;font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.65}
.dk-h{margin:0;font-size:clamp(2rem,6vw,3.6rem);line-height:1.02;letter-spacing:-.02em;text-wrap:balance}
.dk-sub{margin:0;opacity:.7;line-height:1.6}
.dk-deck{--dk-w:min(80vw,520px);--dk-h:min(78vw,460px);position:relative;width:var(--dk-w);height:var(--dk-h);margin-block:10px 34px;perspective:1100px;transform-style:preserve-3d;outline:none;touch-action:pan-y}
.dk-deck:focus-visible{outline:2px solid currentColor;outline-offset:14px;border-radius:12px}
.dk-card{position:absolute;inset:0;margin:auto;padding:8px;background:#f2efe9;border-radius:10px;box-shadow:0 22px 50px rgba(0,0,0,.5);cursor:grab;user-select:none;transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .45s;will-change:transform}
.dk-card:active{cursor:grabbing}
.dk-inner{position:relative;width:100%;height:100%;overflow:hidden;border-radius:6px}
.dk-card::before{content:"";position:absolute;inset:-3px;border-radius:13px;padding:3px;background:conic-gradient(from var(--dk-a),#ff7a3d,#ff3d9a,#7a5cff,#2de2c0,#ff7a3d);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);mask-composite:exclude;opacity:.45;pointer-events:none}
.dk-top::before{opacity:1;animation:dk-spin 3.5s linear infinite}
.dk-top{box-shadow:0 22px 50px rgba(0,0,0,.5),0 0 34px rgba(255,90,140,.28)}
@property --dk-a{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes dk-spin{to{--dk-a:360deg}}
.dk-rip{position:absolute;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;background:rgba(255,255,255,.7);transform:scale(0);animation:dk-rip .6s ease-out forwards;pointer-events:none}
@keyframes dk-rip{to{transform:scale(18);opacity:0}}
.dk-card img{display:block;width:100%;height:100%;object-fit:cover;border-radius:6px;pointer-events:none}
.dk-ph{width:100%;height:100%;border-radius:6px;background:#e4e0d8;color:#444;display:grid;place-content:center;gap:6px;text-align:center;padding:12px;font-size:13px}
.dk-ph span{font-size:11px;opacity:.7;word-break:break-all}
.dk-meta{display:flex;gap:12px;align-items:baseline;justify-content:center;flex-wrap:wrap;text-align:center}
.dk-tag{font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:4px 10px;border:1px solid currentColor;border-radius:999px;opacity:.75}
.dk-title{font-size:1.15rem;font-weight:600}
.dk-count{font-size:12px;opacity:.6;font-variant-numeric:tabular-nums}
.dk-ctl{display:flex;gap:10px}
.dk-ctl button{font:inherit;font-size:14px;color:inherit;background:transparent;border:1px solid currentColor;border-radius:999px;padding:9px 20px;cursor:pointer;opacity:.85}
.dk-ctl button{transition:transform .12s,border-color .2s}
.dk-ctl button:hover{opacity:1;border-color:#ff7a3d}
.dk-ctl button:active{transform:scale(.92)}
.dk-ctl button:focus-visible{outline:2px solid currentColor;outline-offset:3px}
.dk-hint{margin:-8px 0 0;font-size:12px;opacity:.55;text-align:center}
.dk-lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;gap:12px;padding:24px 12px;background:rgba(6,8,14,.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;animation:dk-lb-bg .25s ease-out}
.dk-lb-fig{margin:0;display:grid;gap:12px;justify-items:center;min-width:0;animation:dk-lb-in .35s cubic-bezier(.2,.8,.2,1)}
.dk-lb-img{display:block;max-width:min(88vw,1200px);max-height:80vh;width:auto;height:auto;border-radius:10px;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 3px rgba(255,255,255,.12)}
.dk-lb-ph{width:min(70vw,420px);height:min(60vh,520px)}
.dk-lb figcaption{display:flex;gap:10px;align-items:center;font-size:15px}
.dk-lb-x{position:absolute;top:16px;right:16px;font:inherit;font-size:14px;color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:8px 18px;cursor:pointer}
.dk-lb-nav{flex:none;width:44px;height:44px;font-size:30px;line-height:1;color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.35);border-radius:50%;cursor:pointer}
.dk-lb-x:hover,.dk-lb-nav:hover{background:rgba(255,255,255,.22)}
.dk-lb-x:focus-visible,.dk-lb-nav:focus-visible{outline:2px solid #fff;outline-offset:3px}
@media (max-width:640px){.dk-lb-nav{position:absolute;bottom:20px;width:48px;height:48px}.dk-lb-prev{left:20px}.dk-lb-next{right:20px}}
@keyframes dk-lb-bg{from{opacity:0}}
@keyframes dk-lb-in{from{opacity:0;transform:scale(.9) translateY(14px)}}
@media (prefers-reduced-motion:reduce){.dk-lb,.dk-lb-fig{animation:none}}
@media (prefers-reduced-motion:reduce){.dk-card{transition:none}.dk-top::before,.dk-rip{animation:none}}
`;
