"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClientsHeader } from "@/features/clients/components/ClientsHeader"
import { ClientsGrid } from "@/features/clients/components/ClientsGrid"
import { clientLogos } from "@/features/clients/data"
import { useLanguage } from "@/features/i18n/LanguageProvider"

export default function ClientesView() {
  const { t } = useLanguage()
  const text = t.clients.page

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-12rem] top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--primary)/0.10)_1px,transparent_0)] [background-size:36px_36px]" />
      </div>

      <section className="mx-auto w-full max-w-[110rem] px-4 pb-14 pt-24 sm:px-6 sm:pt-28 md:pb-18 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-border/70 bg-card/70 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8 lg:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            <Sparkles className="h-4 w-4" />
            {text.eyebrow}
          </div>

          <ClientsHeader title={text.title} subtitle={text.subtitle} />

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {text.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/70 bg-background/75 p-4 shadow-sm">
                <p className="text-3xl font-black text-primary">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-muted-foreground">{text.hint}</p>
        </div>

        <div className="relative mt-10 md:mt-12 lg:mt-14">
          <div className="pointer-events-none absolute -inset-x-6 -inset-y-8 hidden rounded-[2.5rem] bg-gradient-to-b from-primary/10 via-card/20 to-transparent blur-xl lg:block" />
          <ClientsGrid items={clientLogos} />

          <div className="mt-12 flex justify-center md:mt-16">
            <Link href="/#contact" className="inline-block" aria-label={text.contact}>
              <Button variant="outline" className="group rounded-2xl px-6">
                {text.cta}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
