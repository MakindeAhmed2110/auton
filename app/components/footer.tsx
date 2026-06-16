const FOOTER_LINKS = {
  Product: [
    { label: "Markets", href: "#markets" },
    { label: "Docs", href: "#docs" },
    { label: "API", href: "#docs" },
  ],
  "$AUTO": [
    { label: "Staking", href: "/staking" },
    { label: "Treasury", href: "/treasury" },
    { label: "Token", href: "#auto" },
  ],
  Resources: [
    { label: "Blog", href: "#" },
    { label: "X", href: "https://x.com" },
    { label: "Telegram", href: "https://t.me" },
  ],
};

export function Footer() {
  return (
    <footer id="docs" className="mt-8 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <a href="/" className="pixel-serif-logo text-lg text-white">
              AUTON
            </a>
            <p className="pixel-sans mt-3 max-w-[220px] text-xs text-white/40">
              The derivatives layer for decentralized compute.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <div className="pixel-sans mb-3 text-xs tracking-widest text-white/40">
                {section === "$AUTO" ? (
                  <>
                    <span className="dollar">$</span>AUTO
                  </>
                ) : (
                  section.toUpperCase()
                )}
              </div>
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="pixel-sans text-sm text-white/60 transition-colors hover:text-white"
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
