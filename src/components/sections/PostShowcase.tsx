"use client";

/**
 * PostShowcase: the same animated 3D frame, built for your post animations.
 *
 *  - Every frame is exactly 1080 x 1350 (4:5), the Instagram post size, so
 *    export your animations at 1080 x 1350 and they fill the frame with no bars.
 *  - Each file can be a video (.mp4 .webm), an animated .gif / .webp, or a still image.
 *    Videos play on loop, silent, and only the front one plays.
 *  - Click a side frame, use the arrows, swipe, or press the left and right arrow
 *    keys to bring another to the front.
 *
 *  - YouTube links work too. A YouTube post shows its thumbnail first and only loads
 *    the player when you press play, so the page stays light and fast.
 *
 * No packages needed. Put your files in  public/posts  and list them below.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";

/* ------------------------------------------------------------------ edit me */

type Post = {
  src?: string;     // file inside /public, no "public" in the path
  youtube?: string; // OR a YouTube link (watch, youtu.be or Shorts link) or just the video ID
  title: string;
  tag: string;
  poster?: string;  // optional still image shown while a video loads
};

/**
 * One line per post. `src` can be .mp4 .webm .mov (video) or .gif .webp .png .jpg.
 * A file that is missing shows a placeholder, so the frame works before you add files.
 */
const POSTS: Post[] = [
  { youtube: "https://youtube.com/shorts/DvxjCXa_0Y0?si=EB5QAj0bPy4vh-Ma", title: "YouTube video example", tag: "YouTube" },
  { youtube: "https://youtube.com/shorts/7deJmGqjKAY?si=4IN_-X1Fg4zttZbb", title: "YouTube video example", tag: "YouTube" },
  { youtube: "https://youtube.com/shorts/Ix70hRZpRa4?si=WkirZK6Ccv4Megpc", title: "YouTube video example", tag: "YouTube" },
  { youtube: "https://youtube.com/shorts/y9HiPWpFNBk?si=2S5KPoDyb7cT3dB-", title: "YouTube video example", tag: "YouTube" },
];

const EYEBROW = "Post animations";
const HEADING = "Make the posts live";
const SUBHEAD = "Animated posts.... Drag, swipe or click a frame to bring it forward.";
const AUTOPLAY_MS = 7000; // time before the next post comes forward. Set to 0 to turn off.
/** Accepts a full YouTube link (watch, youtu.be, shorts, embed) or a bare 11 character ID. */
function parseYouTube(v: string): { id: string; tall: boolean } | null {
  const m =
    v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/) ||
    v.match(/^([\w-]{11})$/);
  return m ? { id: m[1], tall: /\/shorts\//.test(v) } : null;
}
const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

/* ------------------------------------------------------------------ helpers */

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/** Shortest signed distance around the ring, so the shelf wraps endlessly. */
function ringOffset(d: number, n: number) {
  const h = n / 2;
  if (d > h) d -= n;
  if (d < -h) d += n;
  return d;
}

const CSS = `
.ps-sec{position:relative;overflow:hidden;padding:7rem 0}
.ps-wrap{max-width:1240px;margin:0 auto;padding:0 clamp(20px,4vw,32px)}
.ps-eyebrow{font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#00d2ff;margin:0 0 14px}
.ps-h{margin:0;font-size:clamp(2.1rem,5.2vw,4rem);line-height:1.02;letter-spacing:-.02em;font-weight:700}
.ps-sub{margin:16px 0 0;max-width:52ch;color:#9fb4bd;font-size:clamp(.95rem,1.4vw,1.1rem);line-height:1.6}

.ps-scene{position:relative;margin-top:clamp(28px,5vw,56px);perspective:1500px;perspective-origin:50% 38%;outline:none;touch-action:pan-y}
.ps-scene:focus-visible{box-shadow:0 0 0 2px rgba(0,210,255,.6);border-radius:18px}
.ps-halo{position:absolute;left:50%;top:46%;width:min(720px,92%);aspect-ratio:1.6;transform:translate(-50%,-50%);
  background:radial-gradient(closest-side,rgba(0,210,255,.20),rgba(45,212,191,.07) 55%,rgba(0,0,0,0));filter:blur(8px);pointer-events:none}
.ps-float{position:relative;transform-style:preserve-3d;animation:ps-float 7s ease-in-out infinite}
.ps-stage{--w:clamp(200px,29vw,330px);--rx:0deg;--ry:0deg;--gx:50%;--gy:30%;
  position:relative;height:calc(var(--w) * 1.25);transform-style:preserve-3d;
  transform:rotateX(var(--rx)) rotateY(var(--ry));transition:transform .35s cubic-bezier(.16,1,.3,1);
  cursor:grab}
.ps-stage:active{cursor:grabbing}

.ps-card{position:absolute;left:50%;top:0;width:var(--w);margin-left:calc(var(--w) / -2);
  transform-style:preserve-3d;
  transition:transform .9s cubic-bezier(.16,1,.3,1),opacity .6s ease;will-change:transform}
.ps-frame{position:relative;padding:10px;border-radius:6px;background:linear-gradient(145deg,#0f1c27,#060b12);
  border:1px solid rgba(56,189,248,.30);
  box-shadow:1px 1px 0 #0a2230,2px 2px 0 #0a2230,3px 3px 0 #08202c,4px 4px 0 #071b26,5px 5px 0 #061621,
    0 34px 60px -24px rgba(0,0,0,.85),0 0 0 rgba(0,210,255,0);
  transition:box-shadow .6s ease,border-color .6s ease}
.ps-card.is-front .ps-frame{border-color:rgba(0,210,255,.6);
  box-shadow:1px 1px 0 #0a2230,2px 2px 0 #0a2230,3px 3px 0 #08202c,4px 4px 0 #071b26,5px 5px 0 #061621,
    0 40px 70px -26px rgba(0,0,0,.9),0 0 46px rgba(0,210,255,.20)}
.ps-card.is-side{cursor:pointer}
.ps-art{position:relative;aspect-ratio:1080 / 1350;background:#050a11;overflow:hidden;border-radius:2px}
.ps-img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;display:block;user-select:none;-webkit-user-drag:none}
.ps-ph{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;gap:6px;padding:16px;box-sizing:border-box;
  background:linear-gradient(160deg,#0d2a36,#08121b 60%,#1a1030);color:#cfe7ee}
.ps-ph b{font-size:15px;font-weight:600}
.ps-ph code{font-size:11px;color:#7fd8ee;word-break:break-all}
.ps-ph span{font-size:11px;color:#8aa3ad}
.ps-yt-bg{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;filter:blur(18px) brightness(.6);transform:scale(1.25);user-select:none}
.ps-yt-fg{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;user-select:none}
.ps-yt-box{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#000;z-index:3}
.ps-yt-wide{width:100%;aspect-ratio:16 / 9;border:0;display:block}
.ps-yt-tall{height:100%;aspect-ratio:9 / 16;border:0;display:block}
.ps-yt-play{position:absolute;left:50%;top:50%;width:68px;height:68px;margin:-34px 0 0 -34px;border-radius:50%;border:1px solid rgba(255,255,255,.55);
  background:rgba(255,0,0,.88);color:#fff;display:grid;place-items:center;cursor:pointer;z-index:4;transition:transform .25s,background .25s}
.ps-yt-play:hover{transform:scale(1.1);background:#ff1a1a}
.ps-yt-play:focus-visible{outline:2px solid #fff;outline-offset:3px}
.ps-yt-play svg{width:28px;height:28px;margin-left:3px}
.ps-glare{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .4s;
  background:radial-gradient(circle at var(--gx) var(--gy),rgba(255,255,255,.20),rgba(255,255,255,0) 46%);mix-blend-mode:screen}
.ps-card.is-front .ps-glare{opacity:1}
.ps-shade{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;background:rgba(2,4,10,.55);transition:opacity .6s}
.ps-card.is-front .ps-shade{opacity:0}

.ps-bar{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-top:clamp(26px,4vw,44px)}
.ps-meta{min-width:0}
.ps-meta b{display:block;font-size:clamp(1.05rem,1.8vw,1.35rem);font-weight:600}
.ps-meta span{font-size:13px;color:#9fb4bd;letter-spacing:.04em}
.ps-meta a{color:#00d2ff;margin-left:14px;font-size:13px;text-decoration:none}
.ps-meta a:hover{text-decoration:underline}
.ps-ctl{display:flex;align-items:center;gap:14px}
.ps-btn{width:44px;height:44px;border-radius:50%;border:1px solid rgba(56,189,248,.32);background:rgba(4,12,28,.6);color:#e8f4f8;
  display:grid;place-items:center;cursor:pointer;transition:background .3s,border-color .3s,color .3s}
.ps-btn:hover{background:#00d2ff;border-color:#00d2ff;color:#02040a}
.ps-btn:focus-visible{outline:2px solid #00d2ff;outline-offset:2px}
.ps-btn svg{width:16px;height:16px;display:block}
.ps-dots{display:flex;gap:8px;align-items:center}
.ps-dot{width:8px;height:8px;border-radius:50%;border:0;padding:0;background:rgba(223,231,224,.25);cursor:pointer;transition:background .3s,transform .3s}
.ps-dot.on{background:#00d2ff;transform:scale(1.35)}
.ps-count{font-size:12px;letter-spacing:.14em;color:#9fb4bd;font-variant-numeric:tabular-nums}

@keyframes ps-float{0%{transform:translate3d(0,0,0) rotateZ(0deg)}50%{transform:translate3d(0,-9px,0) rotateZ(.35deg)}100%{transform:translate3d(0,0,0) rotateZ(0deg)}}
@media (prefers-reduced-motion:reduce){.ps-float{animation:none}.ps-card,.ps-stage{transition:none}}
@media (max-width:640px){.ps-sec{padding:4.5rem 0}.ps-stage{--w:clamp(190px,56vw,300px)}}
`;

/* ---------------------------------------------------------------- YouTube face */

/**
 * Light by design: it shows the YouTube thumbnail and a play button. The real
 * player (an iframe) only exists after you press play, and only for one post at a time.
 */
function YouTubeFace({
  link, title, front, playing, onPlay, onBad,
}: {
  link: string; title: string; front: boolean; playing: boolean; onPlay: () => void; onBad: () => void;
}) {
  const yt = parseYouTube(link);
  // a bad link flags the post once, so it shows the placeholder
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!parseYouTube(link)) onBad(); }, [link]);
  if (!yt) return null;
  const thumb = `https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg`;
  const embed =
    `https://www.youtube-nocookie.com/embed/${yt.id}?autoplay=1&mute=1&loop=1&playlist=${yt.id}` +
    `&playsinline=1&controls=1&modestbranding=1&rel=0`;
  return (
    <>
      {/* blurred copy fills the 4:5 frame, the sharp copy sits on top without cropping */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ps-yt-bg" src={thumb} alt="" aria-hidden="true" loading="lazy" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ps-yt-fg" src={thumb} alt={title} loading="lazy" draggable={false} />
      {playing ? (
        <div className="ps-yt-box">
          <iframe
            className={yt.tall ? "ps-yt-tall" : "ps-yt-wide"}
            src={embed}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      ) : (
        front && (
          <button
            type="button"
            className="ps-yt-play"
            aria-label={`Play ${title}`}
            onClick={(e) => { e.stopPropagation(); onPlay(); }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          </button>
        )
      )}
    </>
  );
}

/* ---------------------------------------------------------------- component */

export default function PostShowcase() {
  const n = POSTS.length;
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const visibleRef = useRef(true);
  const reduceRef = useRef(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [inView, setInView] = useState(true);
  const [ytPlaying, setYtPlaying] = useState<number | null>(null);
  const ytRef = useRef<number | null>(null);
  ytRef.current = ytPlaying;

  const go = useCallback((d: number) => setActive((a) => (a + d + n) % n), [n]);

  /* autoplay: pauses on hover and when the section is off screen */
  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = sceneRef.current;
    let io: IntersectionObserver | undefined;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; setInView(e.isIntersecting); }, { threshold: 0.25 });
      io.observe(el);
    }
    if (reduceRef.current || n < 2 || !AUTOPLAY_MS) return () => io?.disconnect();
    const id = window.setInterval(() => {
      if (!hoverRef.current && visibleRef.current && !drag.current && ytRef.current === null) setActive((a) => (a + 1) % n);
    }, AUTOPLAY_MS);
    return () => { window.clearInterval(id); io?.disconnect(); };
  }, [n]);

  /* the YouTube player is removed as soon as another post comes forward or you scroll away */
  useEffect(() => {
    setYtPlaying((p) => (p !== null && (p !== active || !inView) ? null : p));
  }, [active, inView]);

  /* only the front video plays, and only while the section is on screen */
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, inView]);

  /* tilt toward the cursor + glare position, written straight to CSS variables */
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    if (drag.current && Math.abs(e.clientX - drag.current.x) > 6) drag.current.moved = true;
    if (reduceRef.current || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const px = clamp((e.clientX - r.left) / r.width - 0.5, -0.8, 0.8);
    const py = clamp((e.clientY - r.top) / r.height - 0.5, -0.8, 0.8);
    el.style.setProperty("--ry", `${(px * 22).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-py * 14).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
  };
  const resetTilt = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--gx", "50%");
    el.style.setProperty("--gy", "30%");
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => { drag.current = { x: e.clientX, moved: false }; };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
    // keep `moved` readable for the click that follows, then clear
    window.setTimeout(() => { drag.current = null; }, 0);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  const cur = POSTS[active];

  return (
    <section id="posts" className="ps-sec" aria-label="Post animations">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ps-wrap">
        <p className="ps-eyebrow">{EYEBROW}</p>
        <h2 className="ps-h font-display">{HEADING}</h2>
        <p className="ps-sub">{SUBHEAD}</p>

        <div
          ref={sceneRef}
          className="ps-scene"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Post animation gallery"
          onKeyDown={onKey}
          onPointerEnter={() => { hoverRef.current = true; }}
          onPointerLeave={() => { hoverRef.current = false; resetTilt(); }}
          onPointerMove={onMove}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => { drag.current = null; }}
        >
          <div className="ps-halo" aria-hidden="true" />
          <div className="ps-float">
            <div ref={stageRef} className="ps-stage">
              {POSTS.map((d, i) => {
                const off = ringOffset(i - active, n);
                const abs = Math.abs(off);
                const front = off === 0;
                const style: CSSProperties = {
                  transform: `translate3d(${off * 60}%,0,${-abs * 170}px) rotateY(${clamp(-off, -1, 1) * 38}deg) scale(${(1 - abs * 0.06).toFixed(3)})`,
                  opacity: abs > 2 ? 0 : abs > 1 ? 0.75 : 1,
                  zIndex: 20 - Math.round(abs * 2),
                  pointerEvents: abs > 2 ? "none" : "auto",
                };
                return (
                  <div
                    key={(d.src ?? d.youtube ?? "") + i}
                    className={"ps-card " + (front ? "is-front" : "is-side")}
                    style={style}
                    aria-hidden={abs > 2}
                    aria-label={`${d.title}, ${i + 1} of ${n}`}
                    onClick={() => { if (!front && !drag.current?.moved) setActive(i); }}
                  >
                    <div className="ps-frame">
                      <div className="ps-art">
                        {failed[i] ? (
                          <div className="ps-ph">
                            <b>Add your post here</b>
                            <code>{d.src ? `public${d.src}` : "check the YouTube link"}</code>
                            <span>{d.title}</span>
                          </div>
                        ) : (
                          d.youtube ? (
                            <YouTubeFace
                              link={d.youtube}
                              title={d.title}
                              front={front}
                              playing={ytPlaying === i}
                              onPlay={() => setYtPlaying(i)}
                              onBad={() => setFailed((f) => (f[i] ? f : { ...f, [i]: true }))}
                            />
                          ) : VIDEO_RE.test(d.src ?? "") ? (
                            <video
                              ref={(el) => { videos.current[i] = el; }}
                              className="ps-img"
                              src={d.src}
                              poster={d.poster}
                              muted
                              loop
                              playsInline
                              preload={abs <= 1 ? "auto" : "metadata"}
                              aria-label={d.title}
                              onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className="ps-img"
                              src={d.src}
                              alt={d.title}
                              draggable={false}
                              loading={abs <= 1 ? "eager" : "lazy"}
                              onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                            />
                          )
                        )}
                        <div className="ps-shade" />
                        <div className="ps-glare" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="ps-bar">
          <div className="ps-meta" aria-live="polite">
            <b className="font-display">{cur.title}</b>
            <span>{cur.tag}</span>
            {!failed[active] && (
              <a
                href={cur.youtube ? `https://www.youtube.com/watch?v=${parseYouTube(cur.youtube)?.id ?? ""}` : cur.src}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cur.youtube ? "Watch on YouTube" : "Open full size"}
              </a>
            )}
          </div>
          <div className="ps-ctl">
            <span className="ps-count">{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
            <div className="ps-dots" role="tablist" aria-label="Choose a post">
              {POSTS.map((d, i) => (
                <button
                  key={(d.src ?? d.youtube ?? "") + i}
                  type="button"
                  className={"ps-dot" + (i === active ? " on" : "")}
                  aria-label={`Show ${d.title}`}
                  aria-selected={i === active}
                  role="tab"
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
            <button type="button" className="ps-btn" aria-label="Previous post" onClick={() => go(-1)}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3 5 8l5 5" /></svg>
            </button>
            <button type="button" className="ps-btn" aria-label="Next post" onClick={() => go(1)}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m6 3 5 5-5 5" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
