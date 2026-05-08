"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Calculator,
  ChevronLeft,
  ChevronRight,
  FileText,
  Headphones,
  Heart,
  Lock,
  MapPin,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react"
import { useLanguage } from "@/features/i18n/LanguageProvider"

const featureIcons = [ReceiptText, PackageCheck, BarChart3, ShieldCheck, FileText, Headphones, Calculator]
const appLogo = "/images/app-web/tacufact-logo.svg"

type ImageSlide = {
  src: string
  alt: string
  label: string
}

// Replace these routes with your real TacuFact screenshots when the final images are ready.
const productScreenshotSlides: ImageSlide[] = [
  {
    src: "/images/app-web/product-slider/01-dte-type.png",
    alt: "TacuFact DTE emission screen",
    label: "DTE",
  },
  {
    src: "/images/app-web/product-slider/02-payment-review.png",
    alt: "TacuFact payment and review screen",
    label: "Pago",
  },
  {
    src: "/images/app-web/product-slider/03-login.png",
    alt: "TacuFact login screen",
    label: "Login",
  },
  {
    src: "/images/app-web/product-slider/04-register.png",
    alt: "TacuFact register screen",
    label: "Registro",
  },
]

// Replace these two routes with the images you want to show in the hero product card.
const heroProductSlides: ImageSlide[] = [
  {
    src: "/images/app-web/hero-slider/01-app-logo.png",
    alt: "TacuFact app logo showcase",
    label: "Logo",
  },
  {
    src: "/images/app-web/hero-slider/02-mascot.png",
    alt: "TacuFact mascot showcase",
    label: "Mascota",
  },
]

function ImageSlider({
  slides,
  intervalMs = 5500,
  imageClassName = "object-contain",
  aspectClassName = "aspect-[16/10]",
  showLabels = true,
}: {
  slides: ImageSlide[]
  intervalMs?: number
  imageClassName?: string
  aspectClassName?: string
  showLabels?: boolean
}) {
  const [activeSlide, setActiveSlide] = useState(0)
  const activeImage = slides[activeSlide]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, intervalMs)

    return () => window.clearInterval(intervalId)
  }, [intervalMs, slides.length])

  const goToSlide = (index: number) => setActiveSlide((index + slides.length) % slides.length)

  return (
    <div className="relative w-full">
      <div className={`relative w-full overflow-hidden rounded-[1.5rem] border border-border bg-background/80 shadow-2xl ${aspectClassName}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage.src}
            initial={{ opacity: 0, x: 80, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -80, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="(max-width: 768px) 92vw, (max-width: 1280px) 70vw, 900px"
              className={imageClassName}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        {showLabels ? (
          <p className="text-center text-sm font-bold text-muted-foreground sm:text-left">
            {activeImage.label}
          </p>
        ) : (
          <span aria-hidden="true" />
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goToSlide(activeSlide - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all ${activeSlide === index ? "w-9 bg-primary" : "w-2.5 bg-muted-foreground/25"}`}
                aria-label={`Go to ${slide.label}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToSlide(activeSlide + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ProductSlider() {
  const { t } = useLanguage()

  return (
    <div className="relative w-full">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-muted-foreground">TacuFact</p>
          <p className="text-xl font-black text-foreground">{t.appWeb.sliderTitle}</p>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">{t.appWeb.sliderHint}</p>
      </div>
      <ImageSlider
        slides={productScreenshotSlides}
        aspectClassName="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9]"
        imageClassName="object-contain bg-white dark:bg-slate-950"
      />
    </div>
  )
}

function HeroProductImageSlider() {
  return (
    <ImageSlider
      slides={heroProductSlides}
      intervalMs={4800}
      aspectClassName="aspect-square"
      imageClassName="object-contain bg-gradient-to-br from-background via-background to-primary/10 p-4"
      showLabels={false}
    />
  )
}

export default function AppWebView() {
  const { t } = useLanguage()
  const text = t.appWeb

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <section className="relative min-h-screen overflow-hidden px-6 pt-28 pb-16 sm:px-8 lg:px-12 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-10%] top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-[-8%] top-24 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--primary)/0.12)_1px,transparent_0)] [background-size:42px_42px]" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary shadow-sm">
              <Heart className="h-4 w-4 fill-current" />
              {text.badge}
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:mx-0 lg:text-7xl xl:text-8xl">
              {text.heroTitleStart}{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                {text.heroTitleAccent}
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted-foreground lg:mx-0">
              {text.descriptionPrefix} <strong className="font-extrabold text-foreground">{text.descriptionStrong}</strong>
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/#contact"
                className="group inline-flex items-center justify-center rounded-full bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/30"
              >
                {text.primaryCta}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-primary/40 bg-background/70 px-7 py-4 text-base font-bold text-primary backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-primary/10"
              >
                {text.secondaryCta}
              </a>
            </div>

            <div className="mt-8 rounded-3xl border border-primary/25 bg-card/80 p-5 text-left shadow-lg backdrop-blur">
              <p className="text-lg font-black text-foreground">{text.madeBy}</p>
              <p className="mt-2 leading-7 text-muted-foreground">{text.madeBySubtitle}</p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {text.highlights.map((item, index) => {
                const Icon = index === 0 ? Store : MapPin
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                    className="rounded-3xl border border-border/70 bg-card/75 p-5 text-left shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/35"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-foreground">{item.title}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative mx-auto mt-24 w-full max-w-xl sm:mt-20 lg:mt-0"
          >
            <div className="absolute -top-20 left-4 z-20 hidden rounded-3xl border border-border bg-card/95 px-5 py-4 shadow-2xl backdrop-blur sm:block lg:-left-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                  SV
                </div>
                <div>
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {text.localBadgeLabel}
                  </p>
                  <p className="font-black text-foreground">{text.localBadgeValue}</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <div className="mb-7 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 ring-1 ring-primary/30">
                    <Image src={appLogo} alt="TacuFact app logo" width={58} height={58} className="h-14 w-14 object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground">CodeMark</p>
                    <h2 className="text-2xl font-black text-foreground">TacuFact</h2>
                    <p className="mt-1 text-xs font-bold text-primary">{text.madeBy}</p>
                  </div>
                </div>
                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-500">
                  SaaS
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-sm">
                <motion.div
                  initial={{ y: 10, rotate: -2 }}
                  animate={{ y: [10, -8, 10], rotate: [-2, 2, -2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-full"
                >
                  <HeroProductImageSlider />
                </motion.div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">
                {text.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-border/70 bg-background/70 p-4 text-center">
                    <p className="text-2xl font-black text-primary">{metric.value}</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="relative px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <Sparkles className="h-4 w-4" />
              {text.featuresBadge}
            </div>
            <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {text.featuresTitleStart}{" "}
              <span className="text-primary">{text.featuresTitleAccent}</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{text.featuresSubtitle}</p>
          </motion.div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {text.features.map((feature, index) => {
              const Icon = featureIcons[index] ?? BadgeCheck
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/75 p-6 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-primary/35 hover:shadow-primary/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="relative text-2xl font-black text-foreground">{feature.title}</h3>
                  <p className="relative mt-3 leading-7 text-muted-foreground">{feature.description}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-2xl lg:grid-cols-[0.72fr_1.28fr]"
        >
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent" />
            <div className="relative">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-primary">{text.dashboardEyebrow}</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {text.dashboardTitle}
              </h2>
              <p className="mt-4 leading-8 text-muted-foreground">{text.dashboardDescription}</p>
              <div className="mt-8 rounded-3xl border border-primary/20 bg-primary/10 p-5">
                <Lock className="mb-3 h-8 w-8 text-primary" />
                <h3 className="text-xl font-black text-foreground">{text.accountantTitle}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text.accountantDescription}</p>
              </div>
              <Link
                href="/#contact"
                className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-1"
              >
                {text.dashboardCta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="relative bg-muted/30 p-5 sm:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.12),transparent_45%)]" />
            <ProductSlider />
          </div>
        </motion.div>
      </section>
    </main>
  )
}
