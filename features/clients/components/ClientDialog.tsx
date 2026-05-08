"use client"

import Image from "next/image"
import Link from "next/link"
import { PropsWithChildren, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClientItem } from "../types"
import { useLanguage } from "@/features/i18n/LanguageProvider"

export function ClientDialog({ client, children }: PropsWithChildren<{ client: ClientItem }>) {
  const { t } = useLanguage()
  const text = t.clients.dialog
  const initialHero = client.cover ?? client.photos?.[0] ?? client.logo ?? "/placeholder.svg"
  const galleryImages = useMemo(
    () => Array.from(new Set([initialHero, ...(client.photos ?? [])])),
    [client.photos, initialHero],
  )
  const [selectedHero, setSelectedHero] = useState(initialHero)
  const [hoverHero, setHoverHero] = useState<string | null>(null)
  const visibleHero = hoverHero ?? selectedHero

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[92vw] sm:w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[88vh] overflow-y-auto overflow-x-hidden rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[clamp(1.1rem,2.4vw,1.6rem)]">{client.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl border bg-muted/20 shadow-lg">
            <Image
              src={visibleHero}
              alt={`${text.mainImage} ${client.name}`}
              fill
              className="object-cover transition-transform duration-500"
              sizes="(max-width:640px) 90vw, (max-width:1024px) 80vw, 900px"
              onError={() => setSelectedHero(client.logo || "/placeholder.svg")}
            />
            {hoverHero ? (
              <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground shadow backdrop-blur">
                {text.previewing}
              </div>
            ) : null}
          </div>

          <p className="text-muted-foreground leading-relaxed text-[clamp(0.95rem,1.4vw,1rem)]">
            {text.descriptions[(client.slug ?? client.name) as keyof typeof text.descriptions] ?? client.description ?? text.fallback}
          </p>

          {client.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {client.tags.map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}

          {galleryImages.length > 1 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galleryImages.map((src, i) => {
                const isSelected = selectedHero === src

                return (
                  <button
                    key={src}
                    type="button"
                    className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted/20 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                      isSelected ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedHero(src)}
                    onMouseEnter={() => setHoverHero(src)}
                    onMouseLeave={() => setHoverHero(null)}
                    onFocus={() => setHoverHero(src)}
                    onBlur={() => setHoverHero(null)}
                    aria-label={`${text.photo} ${i + 1} ${text.of} ${client.name}`}
                  >
                    <Image
                      src={src}
                      alt={`${text.photo} ${i + 1} ${text.of} ${client.name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width:640px) 44vw, (max-width:1024px) 28vw, 260px"
                      loading="lazy"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground opacity-0 shadow backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                      {i === 0 ? text.mainPhoto : `${text.photo} ${i}`}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : null}

          {client.url ? (
            <div className="pt-2">
              <Link href={client.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="rounded-xl">
                  {text.open}
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
