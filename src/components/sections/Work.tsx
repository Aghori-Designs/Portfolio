"use client";

import { useState, useEffect } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedItem } from "@/components/ui/AnimatedItem";

export default function Work() {
  const [activeVideo, setActiveVideo] = useState<{
    id: string;
    title: string;
    url: string;
    short: boolean;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    if (activeVideo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  const projects = [
    {
      id: 1,
      title: "Minibloxia Trial Edit",
      time: "00:33",
      description: "Trial edit · Edit & color",
      thumbClass: "thumb-3",
      span: "span-4",
      thumbnail: "/thumbnails/minibloxia-trial-edit.jpg",
      videoUrl: "https://youtu.be/DNLYAdcgrYA?si=lwAPQ14YkbbDiJdA",
      youtubeId: "DNLYAdcgrYA",
    },
    {
      id: 2,
      title: "Zoé et Léo vont au marché !",
      time: "04:12",
      description: "2D animation",
      thumbClass: "thumb-1",
      span: "span-4",
      thumbnail: "/thumbnails/zoe-et-leo-vont-au-marche.jpg",
      videoUrl: "https://youtu.be/YDJwyhnhc-o?si=8KLbaLfwoZNkHNiK",
      youtubeId: "YDJwyhnhc-o",
    },
    {
      id: 3,
      title: "Naval Mines",
      time: "01:01",
      description: "Short film · Edit & color",
      thumbClass: "thumb-2",
      span: "span-4",
      thumbnail: "/thumbnails/naval-mines.png",
      videoUrl: "https://youtu.be/bSxGn9n6Ko0?si=GqtOoAGDTsVj-asA",
      youtubeId: "bSxGn9n6Ko0",
    },
    {
      id: 4,
      title: "Heart attack in GYM",
      time: "00:56",
      description: "Documentary · Edit & sound",
      thumbClass: "thumb-1",
      span: "span-4",
      thumbnail: "/thumbnails/heart-attack-in-gym.png",
      videoUrl: "https://youtu.be/kRhWNSX4YTw?si=6YzLVNoIx-E8yI6X",
      youtubeId: "kRhWNSX4YTw",
    },
    {
      id: 5,
      title: "Hypnotherapy",
      time: "04:20",
      description: "Brand film · Edit & color",
      thumbClass: "ratio-doc thumb-4",
      span: "span-4",
      thumbnail: "/thumbnails/Hypnotherapy.jpg",
      videoUrl: "https://youtu.be/mIN359P5s1c?si=6rTg74dsM1dxujdj",
      youtubeId: "mIN359P5s1c",
    },
    {
      id: 6,
      title: "Casa Tupka",
      time: "00:15",
      description: "Music video · Color only",
      thumbClass: "ratio-tall thumb-5",
      span: "span-4",
      thumbnail: "/thumbnails/casa-tupka-jungle-tequila-launch.png",
      videoUrl: "https://youtu.be/YUsSu9zRKBg?si=Zn8NOIyKtybw-WHT",
      youtubeId: "YUsSu9zRKBg",
    },
    {
      id: 7,
      title: "Orgatec India Podcast",
      time: "02:40",
      description: "Podcast · Full post",
      thumbClass: "thumb-6",
      span: "span-4",
      thumbnail: "/thumbnails/where-work-talks-orgatec-india-dialogues.png",
      videoUrl: "https://youtu.be/YUsSu9zRKBg?si=Zn8NOIyKtybw-WHT",
      youtubeId: "YUsSu9zRKBg",
    },
    {
      id: 8,
      title: "IMM Podcaast",
      time: "04:32",
      description: "Podcast · Edit & color",
      thumbClass: "thumb-1",
      span: "span-4",
      thumbnail: "/thumbnails/designing-spaces-inspiring-ideas-imm.png",
      videoUrl: "https://youtu.be/fjobRUgVoA4?si=Y7OVIrZMTa6vIYMB",
      youtubeId: "fjobRUgVoA4",
    },
    {
      id: 9,
      title: "Neet Paper Leak",
      time: "00:53",
      description: "Short film · Edit & color",
      thumbClass: "ratio-short thumb-1",
      span: "span-2",
      thumbnail: "/thumbnails/neet-paper-leak-the-truth.png",
      videoUrl: "https://youtube.com/shorts/eCTZdQxK2HU?si=7mhnXbwYrpyW9hza",
      youtubeId: "eCTZdQxK2HU",
    },
    {
      id: 10,
      title: "Winter Arc Shit",
      time: "00:16",
      description: "Short edit · Gym Edit",
      thumbClass: "ratio-short thumb-1",
      span: "span-2",
      thumbnail: "/thumbnails/winter-arc-jump-rope-workout.png",
      videoUrl: "https://youtube.com/shorts/wFaaW9fRLQ4?si=1g5yl0q8crLZ5zcP",
      youtubeId: "wFaaW9fRLQ4",
    },
    {
      id: 11,
      title: "Pavel petrov owns the night.png",
      time: "00:34",
      description: "Short-form · Edit & captions",
      thumbClass: "ratio-short thumb-1",
      span: "span-2",
      thumbnail: "/thumbnails/pavel-petrov-night.png",
      videoUrl: "https://youtube.com/shorts/9XYXgWKfnpo?si=wo7MWSOS3wieCDtX",
      youtubeId: "9XYXgWKfnpo",
    },
    {
      id: 12,
      title: "IAS TN Seshan",
      time: "00:29",
      description: "Event film · Edit & color",
      thumbClass: "ratio-short thumb-1",
      span: "span-2",
      thumbnail: "/thumbnails/tn-seshan-champion-of-fair-elections.png",
      videoUrl: "https://youtube.com/shorts/YBHKNMQGW3I?si=l0Bm6gbYG4PbtUHd",
      youtubeId: "YBHKNMQGW3I",
    },
    {
      id: 13,
      title: "Swasthya healthy & delicious snacks ",
      time: "00:45",
      description: "Documentary · Edit & sound",
      thumbClass: "ratio-short thumb-1",
      span: "span-2",
      thumbnail: "/thumbnails/swasthya-healthy-and-delicious-snacks.png",
      videoUrl: "https://youtube.com/shorts/JPEk3ipfpOM?si=veDL7eyJlmFPFhUX",
      youtubeId: "JPEk3ipfpOM",
    },
  ];

  return (
    <section id="work" className="pb-[7rem] pt-[7rem]">
      <div className="container">
        <div className="section-head">
          <h2 className="font-display font-bold text-[clamp(2rem,4.5vw,3rem)] leading-[0.98] tracking-tighter mb-[0.75rem]">
            Selected work
          </h2>
          <p className="font-body text-mist text-[1.05rem] max-w-[52ch]">
            A handful of recent edits, from thirty-second cutdowns to feature-length documentary.
          </p>
        </div>
        <AnimatedSection delayChildren={0.2} staggerChildren={0.1}>
          <div className="work-grid">
            {projects.map((project) => (
              <a
                href={project.videoUrl || "#"}
                target={project.videoUrl ? "_blank" : undefined}
                rel={project.videoUrl ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (project.youtubeId) {
                    e.preventDefault();
                    setActiveVideo({
                      id: project.youtubeId,
                      title: project.title,
                      url: project.videoUrl,
                      short: project.videoUrl.includes("/shorts/"),
                    });
                  }
                }}
                key={project.id}
                className={`work-card-link block ${project.span}`}
              >
                <AnimatedItem
                  delay={project.id * 0.05}
                  className="work-card transition-[transform] duration-300 hover:-translate-y-[4px]"
                >
                  <div
                    className={`work-thumb relative rounded-[16px] overflow-hidden mb-[0.9rem] ${
                      project.thumbClass.includes("ratio-short")
                        ? "aspect-[9/16]"
                        : project.thumbClass.includes("ratio-tall")
                        ? "aspect-[3/4]"
                        : project.thumbClass.includes("ratio-doc")
                        ? "aspect-[4/5]"
                        : "aspect-[16/9]"
                    } ${!project.thumbnail ? project.thumbClass : ""}`}
                   style={{
  aspectRatio: project.thumbClass.includes("ratio-short") ? "9 / 16" : undefined,
  ...(project.thumbnail
    ? {
        backgroundImage: `url(${project.thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {}),
}}
                  >
                    <span className="thumb-play">▶</span>
                    <span className="thumb-time">{project.time}</span>
                  </div>
                  <h3 className="font-display font-bold text-[1.25rem] mb-[0.2rem]">
                    {project.title}
                  </h3>
                  <p className="font-body text-mist text-[0.9rem]">
                    {project.description}
                  </p>
                </AnimatedItem>
              </a>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Video Lightbox Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className={`relative w-full ${
              activeVideo.short
                ? "max-w-[min(24rem,calc((100vh_-_9rem)*0.5625))]"
                : "max-w-4xl"
            } bg-[#040d22] border border-[rgba(56,189,248,0.2)] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(56,189,248,0.12)] bg-[#071536]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00d2ff] shadow-[0_0_8px_#00d2ff] animate-pulse"></span>
                <h3 className="font-display text-lg md:text-xl font-bold text-[#f1f5f9] m-0">
                  {activeVideo.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#00d2ff] hover:underline flex items-center gap-1"
                >
                  YouTube ↗
                </a>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-full bg-[rgba(56,189,248,0.12)] hover:bg-[rgba(56,189,248,0.25)] text-[#f1f5f9] flex items-center justify-center border-none cursor-pointer transition-colors text-base"
                  aria-label="Close video"
                >
                  ✕
                </button>
              </div>
            </div>
            <div
              className={`relative w-full ${
                activeVideo.short ? "aspect-[9/16]" : "aspect-video"
              } bg-black`}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
