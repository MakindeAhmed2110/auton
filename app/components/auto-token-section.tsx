const TOKEN_STEPS = [
  {
    step: "01",
    title: "Futures Collateral",
    description:
      "Want to lock in GPU capacity at today's price for next month? You post $AUTO as margin. Every open position = $AUTO locked off market. More AI builders = more positions = more $AUTO absorbed.",
  },
  {
    step: "02",
    title: "Verifier Staking",
    description:
      "Compute suppliers stake $AUTO to guarantee their SLA. Go offline mid-contract → get slashed. Stay online → earn a cut of every settlement in $USDC. Slashing risk keeps supply locked longer than pure yield staking.",
  },
  {
    step: "03",
    title: "Buyback & Burn",
    description:
      "100% of futures settlement fees → treasury. Half burns $AUTO on the open market. Half goes to stakers in $USDC.",
  },
] as const;

export function AutoTokenSection() {
  return (
    <section id="auto" className="border-t border-white/10 bg-black py-12 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="pixel-serif text-3xl text-white md:text-4xl lg:text-5xl">
            How <span className="dollar">$</span>AUTO works:
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {TOKEN_STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="pixel-serif text-3xl text-white/60 md:text-4xl">
                  {item.step}
                </span>
              </div>
              <h3 className="pixel-serif mb-3 text-lg text-white md:text-xl">
                {item.title}
              </h3>
              <p className="pixel-sans text-sm leading-relaxed text-white/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center md:mt-16">
          <a
            href="#docs"
            className="pixel-sans inline-block text-xs text-[#80a0c1]/50 transition-colors hover:text-[#80a0c1] md:text-sm"
          >
            Learn more about <span className="dollar">$</span>AUTO →
          </a>
        </div>
      </div>
    </section>
  );
}
