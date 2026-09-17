interface MarqueeProps {
  children: React.ReactNode
  speed?: number
  repeat?: number
}

export function Marquee({ children, speed = 30, repeat = 4 }: MarqueeProps) {
  const items = Array.from({ length: repeat * 2 })

  return (
    <div className="overflow-hidden border-y border-[--border] py-1.5 bg-[--bg-surface]">
      <div
        className="flex w-max"
        style={{ animation: `marquee-loop ${speed}s linear infinite` }}
      >
        {items.map((_, i) => (
          <span
            key={i}
            className="inline-block whitespace-nowrap font-heading text-3xl text-[--text-muted] px-6"
            aria-hidden={i > 0 || undefined}
          >
            {children}
          </span>
        ))}
      </div>
    </div>
  )
}
