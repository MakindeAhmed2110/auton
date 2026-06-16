import { Link } from "react-router";
import { useState } from "react";
import { LoginButton } from "./login-button";

const NAV_LINKS = [
  { label: "Markets", href: "/markets" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Docs", href: "#docs" },
];

const AUTO_LINKS = [
  { label: "Staking", href: "/staking" },
  { label: "Treasury", href: "/treasury" },
  { label: "Token", href: "#auto" },
];

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 py-4">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/80 px-4 py-3 backdrop-blur-sm md:px-6">
          <div className="flex-1">
            <a href="/" className="pixel-serif-logo flex items-center text-lg font-bold text-white md:text-xl">
              AUTON
            </a>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="pixel-sans text-sm tracking-wide text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="group relative">
              <span className="pixel-sans inline-flex cursor-pointer items-center gap-1 text-sm tracking-wide text-white/70 transition-colors group-hover:text-white">
                <span className="dollar">$</span>AUTO
                <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor" className="mt-0.5">
                  <path d="M0 0h8L4 6z" />
                </svg>
              </span>
              <div className="absolute top-full left-1/2 hidden -translate-x-1/2 pt-3 group-hover:block">
                <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/95 px-5 py-3 whitespace-nowrap">
                  {AUTO_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="pixel-sans text-sm tracking-wide text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/70 transition-colors hover:text-white"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/70 transition-colors hover:text-white"
              aria-label="X"
            >
              <XIcon />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/70 transition-colors hover:text-white"
              aria-label="Telegram"
            >
              <TelegramIcon />
            </a>
            <LoginButton />
            <button
              type="button"
              className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={`block h-0.5 w-5 bg-white transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-white transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="mt-2 rounded-2xl border border-white/10 bg-black/95 p-4 md:hidden">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="pixel-sans text-sm tracking-wide text-white/70 transition-colors hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {AUTO_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="pixel-sans text-sm tracking-wide text-white/70 transition-colors hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
