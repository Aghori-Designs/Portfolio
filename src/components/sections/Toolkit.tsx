"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedItem } from "@/components/ui/AnimatedItem";

export default function Toolkit() {
  const tools = [
    {
      id: 1,
      title: "Editing",
      description: "Adobe Premiere Pro · Adobe After Effects",
      className: "tile-wide",
      hasMiniScrubber: true,
      icon: "✂️"
    },
    {
      id: 2,
      title: "Sound Design",
      className: "",
      formatTags: ["Adobe Audition", "Eleven Labs", "Epidemic Sound"],
      hasMiniWaveform: true,
      icon: "🎧"
    },
    {
      id: 3,
      title: "Other tools",
      description: "Canva · Gen AI· AI websites 3D",
      className: "",
      hasMiniWheels: true,
      icon: "⚡"
    },
    {
      id: 4,
      title: "AI Tools",
      className: "tile-full",
      formatTags: ["ChatGPT", "Google Gemini", "Leonardo AI", "Midjourney", "Runway", "Higgsfield", "Claude AI"],
      icon: "🤖"
    },
    {
      id: 5,
      title: "Graphic Design",
      className: "tile-wide",
      formatTags: ["Adobe Photoshop", "Adobe Illustrator", "Canva", "Adobe Lightroom", "Adobe Express"],
      icon: "🎨"
    },
    {
      id: 6,
      title: "Delivery",
      description: "Masters & format exports",
      className: "",
      formatTags: ["ProRes 422 HQ", "H.264", "4K HDR"],
      icon: "📦"
    }
  ];

  return (
    <section id="toolkit" className="pb-[7rem] pt-[7rem] relative overflow-hidden">
      {/* Faint section divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.12) 50%, transparent)"
        }}
        aria-hidden="true"
      />
      <div className="container">
        <AnimatedSection>
          <div className="section-head">
            <h2 className="font-display font-bold text-[clamp(2rem,4.5vw,3rem)] leading-[0.98] tracking-tighter mb-[0.75rem]">
              Toolkit
            </h2>
            <p className="font-body text-mist text-[1.05rem] max-w-[52ch]">
              What&apos;s open on the second monitor, most days.
            </p>
          </div>
        </AnimatedSection>

        <div className="bento-grid">
          {tools.map((tool) => (
            <AnimatedItem
              key={tool.id}
              delay={tool.id * 0.05}
              className={`bento-tile ${tool.className}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl leading-none" role="img" aria-hidden="true">{tool.icon}</span>
                <h3 className="font-display font-bold text-[1.25rem] m-0">{tool.title}</h3>
              </div>
              {tool.description && (
                <p className="text-mist text-[0.9rem] mt-1">{tool.description}</p>
              )}
              {tool.formatTags && (
                <div className="format-tags">
                  {tool.formatTags.map((tag, index) => (
                    <span key={index}>{tag}</span>
                  ))}
                </div>
              )}
              {tool.hasMiniScrubber && (
                <div className="mini-scrubber">
                  <div className="mini-playhead" />
                </div>
              )}
              {tool.hasMiniWaveform && (
                <div className="mini-waveform" aria-hidden="true">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span
                      key={i}
                      style={{ animationDelay: `${i * 0.07}s` }}
                    />
                  ))}
                </div>
              )}
              {tool.hasMiniWheels && (
                <div className="mini-wheels" aria-hidden="true">
                  <span />
                  <span style={{ animationDelay: "-6s" }} />
                  <span style={{ animationDelay: "-12s" }} />
                </div>
              )}
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}