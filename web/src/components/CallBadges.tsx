import { Badge } from "@/components/ui/badge"
import type { Decision, Urgency } from "@/lib/types"

export function DecisionBadge({ decision }: { decision: Decision | null }) {
  if (decision === "qualified") return <Badge variant="success">Qualified</Badge>
  if (decision === "declined") return <Badge variant="secondary">Declined</Badge>
  return <Badge variant="outline">—</Badge>
}

export function UrgencyBadge({ urgency }: { urgency: Urgency | null }) {
  if (urgency === "immediate") return <Badge variant="destructive">Immediate</Badge>
  if (urgency === "standard") return <Badge variant="info">Standard</Badge>
  if (urgency === "low") return <Badge variant="outline">Low</Badge>
  return <Badge variant="outline">—</Badge>
}

export function SolBadge({
  viable,
  days,
}: {
  viable: boolean | null
  days: number | null
}) {
  if (viable === false) return <Badge variant="destructive">Expired</Badge>
  if (viable === true) {
    if (days != null && days < 120)
      return <Badge variant="warning">{days}d left</Badge>
    return <Badge variant="success">Viable</Badge>
  }
  return <Badge variant="outline">—</Badge>
}
