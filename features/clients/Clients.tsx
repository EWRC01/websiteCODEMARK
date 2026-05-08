"use client"
import { useRef, useLayoutEffect, useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { animate, motion, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { NetworkBackground } from "@/components/ui/backgrounds/network-background"
import { useTheme } from "@/app/theme-provider"
import { clientLogos } from "./data"
import { useLanguage } from "@/features/i18n/LanguageProvider"
import { ChevronLeft, ChevronRight } from "lucide-react"

const logoScaleByClient: Record<string, number> = {
  herrerasshipping: 2.15,
  sumachomeremodeling: 2.15,
  "zona-digital": 2.35,
  "mr-h-coffee": 2.25,
  tortisal: 2.35,
  salvalex: 2.2,
}

function getClientKey(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function Clients() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const text = t.clients
  const prefersReducedMotion = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const releaseAutoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [loopWidth, setLoopWidth] = useState(0)

  const SPEED = 34
  const cardWidth = "clamp(240px, 28vw, 360px)"
  const cardHeight = "clamp(150px, 17vw, 210px)"
  const items = useMemo(() => clientLogos, [])
  const x = useMotionValue(0)
  const [paused, setPaused] = useState(false)

  const wrapX = (value: number, width = loopWidth) => {
    if (!width) return value
    if (value <= -width * 2) return value + width
    if (value >= 0) return value - width
    return value
  }

  const pauseAutoplayBriefly = () => {
    setPaused(true)
    if (releaseAutoplayRef.current) clearTimeout(releaseAutoplayRef.current)
    releaseAutoplayRef.current = setTimeout(() => setPaused(false), 3200)
  }

  const shiftCarousel = (direction: 1 | -1) => {
    if (!loopWidth) return
    pauseAutoplayBriefly()
    const step = Math.min(loopWidth / Math.max(items.length, 1), 420)
    const controls = animate(x, wrapX(x.get() + direction * step), {
      type: "spring",
      stiffness: 180,
      damping: 28,
      mass: 0.8,
      onUpdate: (latest) => x.set(wrapX(latest)),
    })
    return () => controls.stop()
  }

  useLayoutEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => {
      const width = el.scrollWidth
      setLoopWidth(width)
      x.set(-width)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useAnimationFrame((_, deltaMs) => {
    if (prefersReducedMotion || paused || !loopWidth) return
    const deltaPx = (SPEED * deltaMs) / 1000
    const next = wrapX(x.get() - deltaPx)
    x.set(next)
  })

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  useEffect(() => {
    return () => {
      if (releaseAutoplayRef.current) clearTimeout(releaseAutoplayRef.current)
    }
  }, [])

  const renderClientLogo = (client: (typeof clientLogos)[number], index: number, clone = false) => {
    const clientKey = getClientKey(client.name)
    const logoScale = logoScaleByClient[clientKey] ?? 2.2

    return (
      <motion.div
        key={`${clone ? "clone" : "client"}-${client?.name ?? "client"}-${index}`}
        className="group/client flex-shrink-0"
        role={clone ? undefined : "listitem"}
        aria-label={clone ? undefined : client?.name ?? text.client}
        whileHover={prefersReducedMotion ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <div
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_70px_-35px_rgba(15,23,42,0.45)] ring-1 ring-white/80 transition-all duration-300 group-hover/client:border-primary/45 group-hover/client:shadow-[0_26px_80px_-32px_rgba(8,145,178,0.55)]"
          style={{ width: cardWidth, height: cardHeight }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.10),transparent_44%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
          <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-white px-3 py-2 shadow-inner shadow-slate-200/70 ring-1 ring-slate-100 transition-transform duration-300 group-hover/client:scale-[1.03]">
              <div className="relative h-full max-h-32 min-h-[88px] w-full">
                <Image
                  src={client.logo || "/placeholder.svg"}
                  alt={clone ? "" : client.name}
                  fill
                  className="object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.24)]"
                  loading="lazy"
                  sizes="(max-width: 640px) 76vw, (max-width: 1024px) 42vw, 28vw"
                  style={{ transform: `scale(${logoScale})` }}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="max-w-full truncate text-sm font-bold text-slate-800 transition-colors duration-300 group-hover/client:text-primary">
                {client.name}
              </span>
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary/70 shadow-[0_0_18px_rgba(8,145,178,0.7)]" />
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <section
      className="relative flex min-h-[50vh] items-center overflow-hidden bg-background py-16 text-foreground md:py-24 lg:py-32"
      id="clients"
      aria-labelledby="clients-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <NetworkBackground color={theme === "dark" ? "#64ffda" : "#0891b2"} density={30} />
      </div>

      <ResponsiveContainer maxWidth="full" paddingX="none">
        <div className="relative z-10">
          <div className="mx-auto mb-8 max-w-4xl px-6 text-center sm:px-8 md:mb-12 lg:mb-14">
            <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              {text.eyebrow}
            </div>
            <ResponsiveText as="h2" id="clients-heading" size="5xl" weight="bold" color="primary" className="mb-4">
              {text.title}
            </ResponsiveText>
            <ResponsiveText as="p" size="xl" color="muted" className="mx-auto max-w-3xl">
              {text.subtitle}
            </ResponsiveText>
          </div>

          <div
            className="relative mx-auto w-[min(100vw-1rem,96rem)] overflow-hidden rounded-[2rem] border border-border/70 bg-card/55 px-0 py-7 shadow-2xl shadow-primary/10 backdrop-blur-xl md:py-10"
            aria-label={text.carousel}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(8,145,178,0.10),transparent)]" />
            <motion.div
              className="relative flex cursor-grab items-center gap-5 px-6 will-change-transform active:cursor-grabbing md:gap-7 md:px-10 lg:gap-9 lg:px-14"
              style={{ x }}
              aria-live="off"
              role="list"
              drag="x"
              dragConstraints={loopWidth ? { left: -loopWidth * 2, right: 0 } : undefined}
              dragElastic={0.08}
              dragMomentum={false}
              onDragStart={() => setPaused(true)}
              onDragEnd={() => {
                x.set(wrapX(x.get()))
                pauseAutoplayBriefly()
              }}
            >
              <div className="flex items-center gap-5 md:gap-7 lg:gap-9" aria-hidden>
                {items.map((client, index) => renderClientLogo(client, index, true))}
              </div>

              <div ref={trackRef} className="flex items-center gap-5 md:gap-7 lg:gap-9">
                {items.map((client, index) => renderClientLogo(client, index))}
              </div>

              <div className="flex items-center gap-5 md:gap-7 lg:gap-9" aria-hidden>
                {items.map((client, index) => renderClientLogo(client, index, true))}
              </div>
            </motion.div>

            <button
              type="button"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-xl backdrop-blur transition hover:border-primary/50 hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary md:left-5"
              onClick={() => shiftCarousel(1)}
              aria-label={text.previousClient}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-xl backdrop-blur transition hover:border-primary/50 hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary md:right-5"
              onClick={() => shiftCarousel(-1)}
              aria-label={text.nextClient}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background via-background/80 to-transparent md:w-36" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background via-background/80 to-transparent md:w-36" />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 px-6 sm:px-8 md:mt-10 md:flex-row">
            <p className="text-sm text-muted-foreground">{text.pauseHint}</p>
            <Link href="/clientes" aria-label={`${text.seeAll} ${text.andDetails}`} className="inline-block">
              <Button size="lg" className="rounded-2xl px-8 shadow-lg shadow-primary/20">
                {text.seeAll}
              </Button>
            </Link>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  )
}
