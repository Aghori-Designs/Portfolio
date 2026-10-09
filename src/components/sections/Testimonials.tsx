"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedItem } from "@/components/ui/AnimatedItem";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "Handed over six hours of raw footage and got back something that made the whole room go quiet at the premiere.",
      author: "Priya N.",
      role: "Director",
      project: "Documentary Feature"
    },
    {
      id: 2,
      quote: "Fast, meticulous, and always finds the one cutaway that saves a scene. Works clean, communicates clearly.",
      author: "Marcus T.",
      role: "Producer",
      project: "Commercial Campaign"
    },
    {
      id: 3,
      quote: "The grade alone changed how the film felt. Same footage, completely different mood — exactly what we needed.",
      author: "Elena R.",
      role: "Cinematographer",
      project: "Music Video"
    }
  ];

  return (
    <section id="testimonials" className="pb-[7rem] pt-[7rem] relative overflow-hidden">
      {/* Subtle section ambient */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[60vw] max-w-[800px] h-[1px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.2) 50%, transparent)"
        }}
        aria-hidden="true"
      />
      <div className="container">
        <AnimatedSection>
          <div className="section-head">
            <h2 className="font-display font-bold text-[clamp(2rem,4.5vw,3rem)] leading-[0.98] tracking-tighter mb-[0.75rem]">
              What collaborators say
            </h2>
            <p className="font-body text-mist text-[1.05rem] max-w-[52ch]">
              Words from directors, producers, and fellow creatives.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <AnimatedItem
              key={testimonial.id}
              delay={i * 0.12}
              className="relative rounded-[24px] p-[2rem] flex flex-col justify-between border border-[rgba(56,189,248,0.1)] bg-[rgba(4,12,28,0.55)] backdrop-blur-[16px] transition-all duration-300 hover:border-[rgba(56,189,248,0.28)] hover:-translate-y-[3px] hover:shadow-[0_12px_40px_-8px_rgba(0,180,216,0.2)]"
              style={{
                boxShadow: "0px 2px 8px -1px rgba(0,0,0,0.6), 0px 8px 24px -4px rgba(2,6,23,0.7), inset 0px 1px 0px 0px rgba(255,255,255,0.06)"
              }}
            >
              {/* Top: quote mark + text */}
              <div>
                <span
                  className="font-display text-[2.8rem] leading-none block mb-3"
                  style={{
                    background: "linear-gradient(135deg, #00d2ff, #2dd4bf)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="font-body text-foreground text-[0.98rem] leading-[1.65] mb-6">
                  {testimonial.quote}
                </p>
              </div>

              {/* Bottom: author */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[rgba(56,189,248,0.1)]">
                <cite className="font-body not-italic flex flex-col gap-0.5">
                  <b className="text-foreground font-semibold text-[0.9rem]">{testimonial.author}</b>
                  <span className="text-mist text-[0.8rem]">{testimonial.role}</span>
                </cite>
                <span className="font-mono-custom text-[0.68rem] tracking-wider text-[rgba(56,189,248,0.5)] uppercase">
                  {testimonial.project}
                </span>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}