import { Link } from "react-router";

const FOOTER_LINKS = {
  Product: [
    { label: "Markets", href: "/markets", external: false },
    { label: "Dashboard", href: "/dashboard", external: false },
    { label: "Docs", href: "#docs", external: false },
    { label: "API", href: "/dashboard", external: false },
  ],
  "$AUTO": [
    { label: "Staking", href: "/staking", external: false },
    { label: "Treasury", href: "/treasury", external: false },
    { label: "Token", href: "/#auto", external: false },
  ],
  Resources: [
    { label: "Blog", href: "#", external: false },
    { label: "X", href: "https://x.com/autonai_sol", external: true },
    { label: "Telegram", href: "https://t.me/autonia_sol", external: true },
  ],
};

export function Footer() {
  return (
    <footer id="docs" className="mt-8 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="pixel-serif-logo text-lg text-white">
              AUTON
            </Link>
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
                {links.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pixel-sans text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : link.href.startsWith("#") || link.href.startsWith("/#") ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className="pixel-sans text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="pixel-sans text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
