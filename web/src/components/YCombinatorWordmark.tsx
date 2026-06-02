import { cn } from "@/lib/utils"

/** Y Combinator wordmark: orange Y square + Combinator text. */
export function YCombinatorWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 132 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", className)}
      role="img"
      aria-label="Y Combinator"
    >
      <rect width="24" height="24" rx="3" fill="#F26522" />
      <path
        fill="#fff"
        d="M9.951 5.841V9.487L7.063 0H4.682L8.318 9.487v7.354H4.682V24h5.269v-6.512h1.319l2.914 6.512h2.381l-3.231-7.199 3.231-7.199h-2.381l-2.914 6.512z"
      />
      <text
        x="30"
        y="17.25"
        fill="currentColor"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="15.5"
        fontWeight="600"
        letterSpacing="-0.02em"
      >
        Combinator
      </text>
    </svg>
  )
}
