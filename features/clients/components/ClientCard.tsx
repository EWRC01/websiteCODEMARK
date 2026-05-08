"use client"

import Image from "next/image"
import { useState } from "react"
import { ArrowUpRight, CalendarDays, Globe2, Sparkles } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ClientItem } from "../types"
import { ClientDialog } from "./ClientDialog"
import { useLanguage } from "@/features/i18n/LanguageProvider"

const FALLBACK_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'>
      <rect width='100%' height='100%' rx='24' fill='#f8fafc'/>
      <g fill='none' stroke='#0891b2' stroke-width='14'>
        <circle cx='256' cy='256' r='110'/>
        <path d='M166 256h180M256 166v180'/>
      </g>
    </svg>`,
  )

export function ClientCard({ client }: { client: ClientItem }) {
  const { t } = useLanguage()
  const text = t.clients.card
  const [src, setSrc] = useState(client.logo || FALLBACK_SVG)
  const alt = client.name ? `${text.logoOf} ${client.name}` : text.clientLogo
  const meta = [
    client.country ? { Icon: Globe2, label: text.country, value: client.country } : null,
    client.year ? { Icon: CalendarDays, label: text.year, value: String(client.year) } : null,
  ].filter(Boolean) as { Icon: typeof Globe2; label: string; value: string }[]

  return (
    <ClientDialog client={client}>
      <button
        className="group block w-full rounded-[2rem] text-left outline-none transition focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`${text.detailsOf} ${client.name}`}
      >
        <Card className="relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 shadow-lg backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_42%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-primary opacity-0 shadow-lg backdrop-blur transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5" />
          </div>

          <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/40 to-primary/10 p-6">
            <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width:640px) 92vw, (max-width:1024px) 45vw, (max-width:1536px) 25vw, 16vw"
              loading="lazy"
              onError={() => {
                if (src !== FALLBACK_SVG) setSrc(FALLBACK_SVG)
              }}
            />
          </div>

          <CardContent className="relative flex flex-1 flex-col p-5">
            <div className="mb-4 flex items-start gap-3">
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <CardTitle className="line-clamp-2 text-xl font-black leading-tight text-foreground" title={client.name}>
                  {client.name}
                </CardTitle>
                {client.industry ? <p className="mt-1 text-sm font-semibold text-muted-foreground">{client.industry}</p> : null}
              </div>
            </div>

            {meta.length ? (
              <div className="mb-4 grid grid-cols-2 gap-2">
                {meta.map(({ Icon, label, value }) => (
                  <div key={label} className="rounded-2xl border border-border/70 bg-background/70 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                    <p className="font-black text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {client.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {client.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full bg-primary/10 text-primary hover:bg-primary/15">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="mt-auto pt-6">
              <span className="inline-flex w-full items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-black text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                {text.openProject}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>
      </button>
    </ClientDialog>
  )
}
