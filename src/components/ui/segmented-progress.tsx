type SegmentedProgressProps = {
  value: number
  label: string
  segments?: number
}

export function SegmentedProgress({
  value,
  label,
  segments = 20,
}: SegmentedProgressProps) {
  const filledSegments = Math.round((value / 100) * segments)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="flex gap-0.5"
    >
      {Array.from({ length: segments }, (_, index) => (
        <span
          key={index}
          className={`h-2.5 w-2 ${
            index < filledSegments ? 'bg-accent' : 'bg-(--bg-surface)'
          }`}
        />
      ))}
    </div>
  )
}
