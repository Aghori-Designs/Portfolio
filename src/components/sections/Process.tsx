"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedItem } from "@/components/ui/AnimatedItem";

export default function Process() {
  const steps = [
    {
      id: 1,
      title: "Ingest",
      description: "Sync footage, audio, and camera notes into one organized project.",
      num: "01"
    },
    {
      id: 2,
      title: "Assemble",
      description: "Build the rough cut and find the shape of the story.",
      num: "02"
    },
    {
      id: 3,
      title: "Refine",
      description: "Tighten pacing, clean up transitions, lock picture.",
      num: "03"
    },
    {
      id: 4,
      title: "Grade & mix",
      description: "Color pass and final audio mix, scene by scene.",
      num: "04"
    },
    {
      id: 5,
      title: "Deliver",
      description: "Export masters in whatever spec the job calls for.",
      num: "05"
    }
  ];

  return (
    <section id="process" className="pb-[7rem] pt-[7rem]">
      <div className="container">
        <div className="section-head">
          <h2 className="font-display font-bold text-[clamp(2rem,4.5vw,3rem)] leading-[0.98] tracking-tighter mb-[0.75rem]">
            How a project moves
          </h2>
          <p className="font-body text-mist text-[1.05rem] max-w-[52ch]">
            Five stages, raw footage to master file.
          </p>
        </div>
        <AnimatedSection delayChildren={0.2} staggerChildren={0.1}>
          <div className="process-rail relative h-[2px] bg-[rgba(237,230,220,0.12)] rounded-[2px] mb-[3rem]">
            <div className="process-rail__nodes absolute inset-0 flex justify-between items-center">
              {steps.map((step, index) => (
                <span
                  key={step.id}
                  className="process-rail__node w-[9px] h-[9px] rounded-full bg-mist"
                />
              ))}
            </div>
            <div className="process-dot absolute left-0 top-[50%] -mt-[5px] w-[10px] h-[10px] rounded-full bg-[#00d2ff] shadow-[0_0_14px_3px_rgba(0,210,255,0.75)]" />
          </div>
          <div className="process-steps grid-cols-5 gap-[1.5rem]">
            {steps.map((step) => (
              <AnimatedItem
                key={step.id}
                delay={step.id * 0.05}
                className="step"
              >
                <span className="font-mono-custom text-[0.78rem] text-[#00d2ff] block mb-[0.6rem]">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-display font-bold text-[1.15rem] mb-[0.4rem]">
                    {step.title}
                  </h3>
                  <p className="font-body text-mist text-[0.88rem]">
                    {step.description}
                  </p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}