export function MissionLegend() {
  return (
    <div className="flex items-start gap-[1.2rem] flex-wrap px-[0.8rem] py-[0.6rem] bg-surface border border-border [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))] mt-auto w-full max-w-[820px]">
      <div className="flex flex-col gap-[0.4rem]">
        <span className="font-display text-[0.45rem] font-bold tracking-[0.2em] text-text-faint uppercase">
          PROGRESSION DU FRONT
        </span>
        <div className="flex items-center gap-[0.5rem]">
          <span className="font-mono text-[0.5rem] text-text-faint tracking-[0.06em] whitespace-nowrap">
            bord
          </span>
          <div className="flex gap-[3px] items-center">
            {[0.2, 0.4, 0.6, 0.8].map((o) => (
              <span
                key={o}
                className="block w-[6px] h-[6px] bg-accent [transform:rotate(45deg)]"
                style={{ opacity: o }}
              />
            ))}
          </div>
          <span className="font-mono text-[0.5rem] text-text-faint tracking-[0.06em] whitespace-nowrap">
            centre
          </span>
        </div>
        <p className="font-mono text-[0.5rem] text-text-faint m-0 leading-[1.4] max-w-[160px]">
          Les directives progressent du bord vers le Core Nexus.
        </p>
      </div>

      <div className="w-px self-stretch bg-border" />

      <div className="flex flex-col gap-[0.4rem]">
        <span className="font-display text-[0.45rem] font-bold tracking-[0.2em] text-text-faint uppercase">
          ÉTAT FINAL
        </span>
        <div className="flex items-center gap-[0.3rem]">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="9" fill="#00e676" fillOpacity="0.15" />
            <polygon points="10,4 16,10 10,16 4,10" fill="#00e676" />
            <circle cx="10" cy="10" r="2" fill="white" fillOpacity="0.9" />
          </svg>
          <span
            className="font-mono text-[0.55rem] tracking-[0.06em]"
            style={{ color: "var(--connected)" }}
          >
            Intégrée au Core
          </span>
        </div>
      </div>
    </div>
  );
}
