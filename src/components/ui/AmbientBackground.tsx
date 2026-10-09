"use client";

import React from "react";

export default function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#02040a]"
      aria-hidden="true"
    >
      {/* Deep space base layer with subtle ambient navy/cobalt glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#010409] via-[#020612] to-[#010308]" />

      {/* Layer 1: Sweeping diffuse deep cobalt bloom in the upper-right & center */}
      <div
        className="absolute -top-[10%] -right-[15%] w-[85vw] h-[85vw] max-w-[1200px] max-h-[1200px] rounded-full opacity-60 mix-blend-screen filter blur-[100px] animate-ambient-drift"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(2, 101, 210, 0.45) 0%, rgba(10, 37, 114, 0.35) 45%, rgba(2, 6, 23, 0) 75%)",
        }}
      />

      {/* Layer 2: Diffuse cyan / azure soft fill on the bottom-left */}
      <div
        className="absolute -bottom-[20%] -left-[10%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full opacity-45 mix-blend-screen filter blur-[120px] animate-ambient-pulse"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, rgba(0, 180, 216, 0.4) 0%, rgba(3, 75, 160, 0.25) 50%, rgba(1, 4, 15, 0) 75%)",
        }}
      />

      {/* Layer 3: The Signature Curved Aurora Ribbon (from user's reference) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-85">
        <svg
          className="w-[140vw] h-[140vh] min-w-[1000px] min-h-[900px] -translate-x-[5%] -translate-y-[2%] animate-ambient-swirl"
          viewBox="0 0 1200 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Main curved ribbon gradient: luminous turquoise -> bright cyan -> deep electric blue -> dark cobalt */}
            <linearGradient id="aurora-glow" x1="250" y1="200" x2="850" y2="750" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#22d3ee" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#0a2569" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="rim-highlight" x1="300" y1="180" x2="700" y2="600" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#2dd4bf" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#0077b6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#001233" stopOpacity="0" />
            </linearGradient>

            {/* Filter for silky liquid blur */}
            <filter id="silk-blur" x="-30%" y="-30%" width="160%" height="160%" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="65" />
            </filter>

            <filter id="intense-core-blur" x="-30%" y="-30%" width="160%" height="160%" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="28" />
            </filter>

            <radialGradient id="center-void" cx="50%" cy="45%" r="35%">
              <stop offset="0%" stopColor="#010308" stopOpacity="0.98" />
              <stop offset="70%" stopColor="#020612" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#020612" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Broad deep cobalt-cerulean aura foundation */}
          <path
            d="M620,120 C820,130 980,300 950,560 C920,800 680,860 480,810 C290,760 180,600 240,410 C290,260 430,110 620,120 Z"
            fill="url(#aurora-glow)"
            filter="url(#silk-blur)"
            opacity="0.7"
          />

          {/* Inner curved ribbon mimicking the intense glowing loop */}
          <path
            d="M640,160 C790,190 880,350 860,550 C830,730 650,780 490,720 C350,670 280,520 330,370 C380,240 500,140 640,160 Z"
            fill="none"
            stroke="url(#rim-highlight)"
            strokeWidth="58"
            strokeLinecap="round"
            filter="url(#intense-core-blur)"
            opacity="0.85"
          />

          {/* Center dark void creating the distinct negative space contrast */}
          <circle cx="530" cy="450" r="280" fill="url(#center-void)" />

          {/* Secondary bright wave fold on the right side */}
          <path
            d="M820,180 C980,320 1060,540 980,720 C920,600 860,400 800,280 Z"
            fill="url(#rim-highlight)"
            filter="url(#silk-blur)"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Subtle overlay mesh for smooth color transitions & vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 40%, rgba(1, 3, 8, 0.75) 100%)",
        }}
      />
    </div>
  );
}
