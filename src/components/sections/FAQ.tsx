"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "What formats do you deliver in?",
      answer: "Masters in ProRes 422 HQ or DNxHR by default, plus H.264 exports sized for web, social, or client review. HDR masters or specific broadcast specs are no problem — just say so up front."
    },
    {
      id: 2,
      question: "Do you handle color and sound, or just the edit?",
      answer: "All of it, or just one piece — whatever the project needs. Most jobs come to me as edit, color, and a final audio pass together, but I'm just as happy to jump in on a locked cut for color or sound alone."
    },
    {
      id: 3,
      question: "What's a typical turnaround?",
      answer: "A short-form edit under five minutes usually takes three to five working days. Longer or documentary-style projects depend on footage volume — I'll give a real estimate after seeing the material."
    },
    {
      id: 4,
      question: "Can you work from my existing Premiere or Resolve project?",
      answer: "Yes — send the project file and media, and I'll pick up wherever it's at rather than starting over."
    },
    {
      id: 5,
      question: "How do revisions work?",
      answer: "Two rounds of revisions are built into every quote. Past that, additional rounds are billed hourly, though most projects land in two."
    }
  ];

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="pb-[7rem] pt-[7rem]">
      <div className="container container-narrow">
        <div className="section-head">
          <h2 className="font-display font-bold text-[clamp(2rem,4.5vw,3rem)] leading-[0.98] tracking-tighter mb-[0.75rem]">
            Good questions
          </h2>
          <p className="font-body text-mist text-[1.05rem] max-w-[52ch]">
            Things people usually ask before we start.
          </p>
        </div>
        <AnimatedSection delayChildren={0.2} staggerChildren={0.1}>
          <div className="faq-list border-t border-[rgba(237,230,220,0.1)]">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`faq-item border-b border-[rgba(237,230,220,0.1)] ${isOpen ? "open" : ""}`}
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="faq-q w-full flex justify-between items-center text-left bg-transparent border-none text-[1.05rem] text-foreground font-body p-[22px_0] cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon relative w-[16px] h-[16px] flex-none">
                      <span className="absolute left-0 top-[7px] w-[16px] h-[2px] bg-foreground rounded" />
                      <span className={`absolute top-0 left-[7px] w-[2px] h-[16px] bg-foreground rounded transition-transform duration-300 ${isOpen ? "rotate-90 opacity-0" : ""}`} />
                    </span>
                  </button>
                  <div
                    className={`faq-a-wrap transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-[300px] opacity-100 pb-[22px]" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="font-body text-mist text-[1rem] leading-[1.6] max-w-[60ch] m-0">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}