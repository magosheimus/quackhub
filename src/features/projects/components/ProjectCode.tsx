import { ColorDot } from '@/components/pickers/color-dot'
import {
  formatTaskCode,
  type ProjectLabel,
} from '@/features/projects/lib/project'
import { NEUTRAL_COLOR } from '@/shared/lib/palette'

type ProjectCodeProps = {
  label: ProjectLabel | undefined
  taskNumber: number
  withColor?: boolean
}

export function ProjectCode({
  label,
  taskNumber,
  withColor = true,
}: ProjectCodeProps) {
  const code = formatTaskCode(label?.prefix ?? '', taskNumber)
  if (!withColor) {
    return <span className="text-caption">{code}</span>
  }
  const color = label?.color ?? NEUTRAL_COLOR
  return (
    <span
      className="flex items-center gap-1.5 text-xs font-medium"
      style={{ color }}
    >
      <ColorDot color={color} />
      {code}
    </span>
  )
}
