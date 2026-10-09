export default function Footer() {
  return (
    <footer className="relative pb-8 pt-8 overflow-hidden">
      {/* Top border with gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(56,189,248,0.25) 30%, rgba(56,189,248,0.45) 50%, rgba(56,189,248,0.25) 70%, transparent)"
        }}
        aria-hidden="true"
      />
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          {/* Brand */}
          <div className="flex flex-col gap-0.5">
            <span
              className="font-display font-extrabold text-[1rem] tracking-wider text-foreground uppercase"
              style={{ letterSpacing: "0.06em" }}
            >
              Pawan Singh Negi
            </span>
            <span className="font-mono-custom text-[0.7rem] tracking-[0.14em] text-mist uppercase">
              Video Editor · AI web devloper · Motion Artist
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-mist text-[0.85rem]" aria-label="Footer navigation">
            <a href="#work" className="hover:text-foreground transition-colors duration-200">Work</a>
            <a href="#toolkit" className="hover:text-foreground transition-colors duration-200">Toolkit</a>
            <a href="#process" className="hover:text-foreground transition-colors duration-200">Process</a>
            <a href="#faq" className="hover:text-foreground transition-colors duration-200">FAQ</a>
            <a href="#contact" className="hover:text-[#00d2ff] transition-colors duration-200">Contact</a>
          </nav>

          {/* Social + copyright */}
          <div className="flex items-center gap-4 text-mist text-[0.82rem]">
            <a
              href="https://www.instagram.com/world_water_wild/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00d2ff] transition-colors duration-200"
              aria-label="Instagram"
            >
              Instagram ↗
            </a>
            <a
              href="https://youtube.com/@aghori_00-z8w?si=47h6taPwZNxF9pVx"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00d2ff] transition-colors duration-200"
              aria-label="YouTube"
            >
              YouTube ↗
            </a>
            <span className="text-[rgba(56,189,248,0.25)]">|</span>
            <span className="font-mono-custom text-[0.75rem]">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}