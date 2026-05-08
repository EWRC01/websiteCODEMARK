"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import NetworkBackground from "@/shared/backgrounds/NetworkBackground"
import { useTheme } from "@/app/theme-provider"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { WordRotate } from "@/components/ui/word-rotate"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import { ResponsiveStack } from "@/components/ui/responsive-stack"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { useIsMobile } from "@/hooks/useBreakpoint"
import { useLanguage } from "@/features/i18n/LanguageProvider"

export default function Home() {
  const homeRef = useRef(null)
  const isMobile = useIsMobile()
  const { theme } = useTheme()
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animations
      gsap.to(".home-subtitle", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      })

      gsap.to(".home-title", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.4,
        stagger: 0.1,
      })

      gsap.to(".home-description", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.8,
      })

      gsap.to(".home-button", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.2,
      })

      gsap.to(".home-image", {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.7,
      })
    }, homeRef)

    return () => ctx.revert()
  }, [])

  const text = t.home

  return (
    <section
      className="relative min-h-screen flex items-center bg-background overflow-hidden py-16 md:py-24 lg:py-32"
      id="home"
      ref={homeRef}
    >
      <NetworkBackground color={theme === "dark" ? "#64ffda" : "#0891b2"} />

      <ResponsiveContainer maxWidth="2xl" paddingX="lg">
        <ResponsiveStack
          direction={{ xs: "column", lg: "row" }}
          gap="xl"
          align="center"
          justify="between"
          className="w-full"
        >
          {/* Content */}
          <div className="flex-1 max-w-3xl text-center lg:text-left pt-24">
            <ResponsiveText
              as="h3"
              size="xl"
              weight="medium"
              color="primary"
              className="home-subtitle mb-4 md:mb-6 opacity-0 translate-y-[30px]" // Initial styles applied here
            >
              {text.eyebrow}
            </ResponsiveText>

            <div className="home-title mb-6 md:mb-8 opacity-0 translate-y-[50px] scale-[0.95]">
              {" "}
              {/* Initial styles applied here */}
              <ResponsiveText as="h1" size="7xl" weight="bold" className="leading-tight">
                <span className="block mb-2 md:mb-3">{text.firstLine}</span>
                <span className="block mb-2 md:mb-3">{text.secondLine}</span>
                <span className="block text-primary">
                  <WordRotate words={text.rotatingWords} interval={3000} animation="slide" />
                </span>
              </ResponsiveText>
            </div>

            <ResponsiveText
              as="p"
              size="lg"
              color="muted"
              className="home-description mb-8 md:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed opacity-0 translate-y-[30px]" // Initial styles applied here
            >
              {text.description}
            </ResponsiveText>

            <div className="home-button opacity-0 translate-y-[20px]">
              {" "}
              {/* Initial styles applied here */}
              <InteractiveHoverButton
                as="a"
                href="#contact"
                className="text-base md:text-lg py-4 md:py-5 px-8 md:px-10 border border-primary"
              >
                {text.cta}
              </InteractiveHoverButton>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 flex justify-center items-center w-full max-w-md lg:max-w-2xl">
            <div className="relative w-full aspect-square md:aspect-auto md:h-auto">
              <Image
                src="/pc.svg"
                alt="CodeMark Illustration"
                width={700}
                height={700}
                className="home-image w-full h-auto filter dark:drop-shadow-[0_0_20px_rgba(100,255,218,0.3)] opacity-0 scale-[0.7] rotate-[10deg]" // Initial styles applied here
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
              />
            </div>
          </div>
        </ResponsiveStack>
      </ResponsiveContainer>
    </section>
  )
}
