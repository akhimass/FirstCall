import { cn } from "@/lib/utils"

/** Black square mark — scales + signal (header / sidebar). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/header-icon.png"
      alt=""
      aria-hidden
      className={cn("size-8 shrink-0 rounded-md object-cover", className)}
    />
  )
}

/** Compact wordmark for nav bars and auth screens. */
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

/** Full stacked logo for marketing hero and footer. */
export function BrandLogoFull({ className }: { className?: string }) {
  return (
    <img
      src="/brand/firstcall-logo-full.png"
      alt="FirstCall Law AI"
      className={cn("mx-auto h-auto w-full max-w-[220px] md:max-w-[260px]", className)}
    />
  )
}
