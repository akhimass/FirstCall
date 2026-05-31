import { Link } from "react-router-dom"
import { Check } from "lucide-react"
import MarketingLayout from "@/components/MarketingLayout"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  PRICING_COMPARISON,
  PRICING_FAQ,
  PRICING_PLANS,
  planSignupHref,
} from "@/lib/marketing"

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="mx-auto size-4 text-emerald-600" aria-label="Included" />
  }
  if (value === false) {
    return <span className="text-muted-foreground">—</span>
  }
  return <span className="text-xs text-muted-foreground">{value}</span>
}

export default function Pricing() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 text-center md:pt-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Simple, firm-friendly pricing</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Pay for intake that qualifies — not voicemail.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          All plans include a 14-day free trial with full Growth features. No credit card required.
          Month-to-month, or save two months with annual billing.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 md:p-8",
                plan.featured
                  ? "border-primary bg-primary text-primary-foreground shadow-lg"
                  : "border-border bg-card",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-0.5 text-xs font-semibold text-foreground">
                  Most popular
                </span>
              )}
              <div>
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    plan.featured ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {plan.bestFor}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.priceLabel}</span>
                  {plan.price !== null && (
                    <span
                      className={cn(
                        "text-sm",
                        plan.featured ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      /mo
                    </span>
                  )}
                </div>
                {plan.annualPrice && (
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      plan.featured ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    ${plan.annualPrice}/mo billed annually
                  </p>
                )}
                <p
                  className={cn(
                    "mt-4 text-sm leading-relaxed",
                    plan.featured ? "text-primary-foreground/90" : "text-muted-foreground",
                  )}
                >
                  {plan.description}
                </p>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <Check
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        plan.featured ? "text-primary-foreground" : "text-foreground",
                      )}
                      strokeWidth={2.5}
                    />
                    <span className={plan.featured ? "text-primary-foreground/95" : undefined}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={cn("mt-8 w-full", plan.featured && "bg-background text-foreground hover:bg-background/90")}
                variant={plan.featured ? "secondary" : "default"}
              >
                <Link to={planSignupHref(plan.id)}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight">Compare plans</h2>
          <div className="mt-10 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 font-medium">Feature</th>
                  <th className="px-4 py-3 text-center font-medium">Starter</th>
                  <th className="px-4 py-3 text-center font-medium">Growth</th>
                  <th className="px-4 py-3 text-center font-medium">Firm</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_COMPARISON.map(({ feature, starter, growth, firm }) => (
                  <tr key={feature} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-muted-foreground">{feature}</td>
                    <td className="px-4 py-3 text-center">
                      <ComparisonCell value={starter} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ComparisonCell value={growth} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ComparisonCell value={firm} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <dl className="mt-10 space-y-8">
          {PRICING_FAQ.map(({ q, a }) => (
            <div key={q}>
              <dt className="font-semibold">{q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center md:px-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Stop losing cases to voicemail.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Most PI firms recover the cost of Growth in one signed case. Start your trial today — live
            before your next missed call.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/signup?plan=growth">Start 14-day free trial →</Link>
          </Button>
        </div>
      </section>
    </MarketingLayout>
  )
}
