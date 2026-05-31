import { cn } from "@/lib/utils"

/** Black square mark — white scales + signal line art. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/header-icon.png"
      alt=""
      aria-hidden
      className={cn("size-9 shrink-0 rounded-lg object-contain", className)}
    />
  )
}

/** Nav bar: header icon + firstcall / Law AI wordmark. */
export function Wordmark({
  className,
  showTagline = false,
}: {
  className?: string
  showTagline?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col justify-center leading-none">
        <span className="text-[1.05rem] font-bold tracking-tight lowercase">firstcall</span>
        {showTagline && (
          <span className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Law AI
          </span>
        )}
      </span>
    </span>
  )
}

/** Full stacked logo (F + firstcall + LAW AI) — marketing only when needed. */
export function BrandLogoFull({ className }: { className?: string }) {
  return (
    <img
      src="/brand/firstcall-logo-full.png"
      alt="FirstCall Law AI"
      className={cn("h-auto w-full max-w-[220px] md:max-w-[260px]", className)}
    />
  )
}
