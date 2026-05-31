import { Link } from "react-router-dom"
import MarketingLayout from "@/components/MarketingLayout"
import { Button } from "@/components/ui/button"
import { HOW_IT_WORKS_STEPS, ON_CALL_FLOW } from "@/lib/marketing"
import { AGENT_NAME } from "@/lib/mock"

export default function HowItWorks() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 md:pt-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Live in minutes</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          Three steps to never missing a call.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          No hardware, no IT project. {AGENT_NAME} runs on Pipecat Cloud with a dedicated Twilio line
          provisioned during signup.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-10 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map(({ step, title, body, detail }) => (
            <div key={step} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-sm font-bold">
                {step}
              </div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground/90">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight">What happens on each call</h2>
          <ol className="mt-10 space-y-4">
            {ON_CALL_FLOW.map((line, i) => (
              <li
                key={line}
                className="flex gap-4 rounded-lg border border-border bg-card px-5 py-4 text-sm"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center md:px-12">
          <blockquote className="mx-auto max-w-2xl">
            <p className="text-xl font-medium leading-relaxed md:text-2xl">
              &ldquo;FirstCall booked four signed cases in its first weekend — calls we would have lost to
              voicemail. It paid for itself before Monday.&rdquo;
            </p>
            <footer className="mt-6 text-sm text-muted-foreground">
              <strong className="text-foreground">James Hartley</strong> · Managing Partner, Hartley
              &amp; Associates
            </footer>
          </blockquote>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">Create your workspace</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
