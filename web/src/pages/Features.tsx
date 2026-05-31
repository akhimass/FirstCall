import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import MarketingLayout from "@/components/MarketingLayout"
import { BackedBy } from "@/components/BackedBy"
import { Button } from "@/components/ui/button"
import { FEATURES, FEATURE_HIGHLIGHTS, STATS } from "@/lib/marketing"

export default function Features() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 md:pt-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Built for plaintiff firms</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          Everything your intake team does — automatically.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          FirstCall isn&apos;t a generic chatbot. It&apos;s trained on personal-injury intake, graded on
          every call, and wired to the same telephony stack your firm already trusts.
        </p>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold tracking-tight">{value}</div>
              <p className="mt-2 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="size-5" strokeWidth={2} />
              </div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {FEATURE_HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background">
                <Icon className="size-5" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border px-6 py-10">
        <BackedBy className="mx-auto max-w-6xl" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">See it on a live call</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Forward a number and watch qualification happen in your dashboard — usually live in under ten
          minutes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/signup">Start free trial</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/how-it-works">
              How it works
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </MarketingLayout>
  )
}
