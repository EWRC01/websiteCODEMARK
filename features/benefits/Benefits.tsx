"use client"
import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Code2, Rocket, HeadphonesIcon } from "lucide-react"
import NetworkBackground from "@/shared/backgrounds/NetworkBackground"
import React from "react"
import { useTheme } from "@/app/theme-provider"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import { ResponsiveStack } from "@/components/ui/responsive-stack"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { useIsMobile, useIsTablet } from "@/hooks/useBreakpoint"
import { useLanguage } from "@/features/i18n/LanguageProvider"

export default function Benefits() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const { t } = useLanguage()

  const benefitMeta = [
    { icon: Code2, color: "#6366f1" },
    { icon: Rocket, color: "#10b981" },
    { icon: HeadphonesIcon, color: "#f43f5e" },
  ]

  const text = t.benefits
  const benefits = text.items.map((benefit, index) => ({ ...benefit, ...benefitMeta[index] }))

  const { theme } = useTheme()

  // Auto-progresión solo cuando no hay hover
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % benefits.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isHovering, benefits.length])

  useEffect(() => {
    controls.start({
      backgroundColor: benefits[activeIndex].color,
      transition: { duration: 0.5 },
    })
  }, [activeIndex, benefits, controls])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = (clientX - left) / width
    const y = (clientY - top) / height

    controls.start({
      background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`,
      transition: { type: "tween", duration: 0.2 },
    })
  }

  const handleBenefitHover = (index: number) => {
    setActiveIndex(index)
    setIsHovering(true)
  }

  const handleBenefitLeave = () => {
    setIsHovering(false)
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-background text-foreground py-16 md:py-24 lg:py-32 overflow-hidden"
      id="benefits"
    >
      <NetworkBackground color={theme === "dark" ? "#10b981" : "#059669"} density={70} />

      <ResponsiveContainer maxWidth="2xl" paddingX="lg">
        <motion.div
          className="w-full bg-card/80 backdrop-blur-md border border-border rounded-3xl p-6 md:p-12 lg:p-16 shadow-lg z-10 transition-all duration-500"
          ref={containerRef}
          animate={controls}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => controls.start({ background: "none" })}
        >
          <div className="text-center mb-8 md:mb-12">
            <ResponsiveText as="h2" size="5xl" weight="bold" className="mb-4">
              {text.title}
            </ResponsiveText>
            <ResponsiveText as="p" size="xl" color="muted" className="max-w-3xl mx-auto">
              {text.subtitle}
            </ResponsiveText>
          </div>

          <ResponsiveStack direction={{ xs: "column", lg: "row" }} gap="lg" align="center" className="w-full">
            <div className="flex flex-col gap-4 md:gap-6 flex-1 w-full">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className={`bg-card/95 backdrop-blur-xl border rounded-xl p-4 md:p-6 transition-all duration-300 cursor-pointer ${
                    index === activeIndex
                      ? "border-primary/50 shadow-lg scale-105 opacity-100"
                      : "border-border opacity-70 hover:opacity-90 hover:border-primary/30 hover:scale-[1.02]"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: index === activeIndex ? 1 : 0.7, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  onMouseEnter={() => handleBenefitHover(index)}
                  onMouseLeave={handleBenefitLeave}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <motion.div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{ backgroundColor: benefit.color }}
                      animate={{
                        scale: index === activeIndex ? 1.1 : 1,
                        boxShadow: index === activeIndex ? `0 0 20px ${benefit.color}40` : "none",
                      }}
                    >
                      <benefit.icon size={isMobile ? 20 : 24} className="text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 transition-colors duration-300 truncate">
                        {benefit.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground transition-colors duration-300 line-clamp-2">
                        {benefit.description}
                      </p>
                    </div>

                    {/* Indicador visual de hover */}
                    <motion.div
                      className="w-1.5 h-6 md:w-2 md:h-8 rounded-full bg-primary/30"
                      animate={{
                        backgroundColor: index === activeIndex ? benefit.color : "rgba(var(--primary), 0.3)",
                        scale: index === activeIndex ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Barra de progreso para el item activo */}
                  {index === activeIndex && !isHovering && (
                    <motion.div
                      className="mt-3 md:mt-4 h-1 bg-muted rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: benefit.color }}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        key={`progress-${activeIndex}`}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex-1 flex justify-center items-center min-h-[250px] md:min-h-[300px] w-full">
              <motion.div
                className="text-center p-6 md:p-8"
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <motion.div
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 relative"
                  style={{ backgroundColor: benefits[activeIndex].color }}
                  animate={{
                    boxShadow: [
                      `0 0 0 0 ${benefits[activeIndex].color}40`,
                      `0 0 0 20px ${benefits[activeIndex].color}00`,
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  {React.createElement(benefits[activeIndex].icon, {
                    size: isMobile ? 48 : 64,
                    className: "text-white relative z-10",
                  })}

                  {/* Efecto de brillo rotativo */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${benefits[activeIndex].color}80, transparent)`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <ResponsiveText as="h3" size="3xl" weight="bold" className="mb-4">
                    {benefits[activeIndex].title}
                  </ResponsiveText>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <ResponsiveText as="p" size="xl" color="muted" className="max-w-md mx-auto">
                    {benefits[activeIndex].description}
                  </ResponsiveText>
                </motion.div>

                {/* Indicador de estado */}
                <motion.div
                  className="mt-4 md:mt-6 flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                    style={{ backgroundColor: benefits[activeIndex].color }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <span>{isHovering ? text.manual : text.auto}</span>
                </motion.div>
              </motion.div>
            </div>
          </ResponsiveStack>

          {/* Indicadores de progreso mejorados - Espaciado aumentado */}
          <div className="flex justify-center items-center gap-6 md:gap-8 mt-8 md:mt-12 px-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-2 md:gap-3 cursor-pointer"
                onMouseEnter={() => handleBenefitHover(index)}
                onMouseLeave={handleBenefitLeave}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "scale-125" : ""
                  }`}
                  style={{
                    backgroundColor: index === activeIndex ? benefit.color : "rgba(var(--muted), 1)",
                  }}
                  animate={{
                    boxShadow: index === activeIndex ? `0 0 10px ${benefit.color}60` : "none",
                  }}
                />

                {/* Etiqueta del beneficio */}
                <motion.span
                  className="text-xs text-muted-foreground text-center max-w-[80px] md:max-w-[100px] leading-tight truncate"
                  animate={{
                    color: index === activeIndex ? benefit.color : "rgba(var(--muted-foreground), 1)",
                    fontWeight: index === activeIndex ? 600 : 400,
                  }}
                >
                  {benefit.title.split(" ")[0]}
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* Información de interacción */}
          <motion.div
            className="text-center mt-6 md:mt-8 text-xs md:text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>
              {isHovering
                ? text.hoverManual
                : text.hoverAuto}
            </p>
          </motion.div>
        </motion.div>
      </ResponsiveContainer>
    </section>
  )
}
