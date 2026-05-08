"use client"
import { useState, useEffect, useRef } from "react"
import React from "react"

import { motion, AnimatePresence, useMotionValue, useSpring, type PanInfo } from "framer-motion"
import { Rocket, Lightbulb, Users, Target, Zap, Sparkles, ArrowRight, Plus, Minus } from "lucide-react"
import NetworkBackground from "@/shared/backgrounds/NetworkBackground"
import { useTheme } from "next-themes"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { useIsMobile, useIsTablet } from "@/hooks/useBreakpoint"
import { useLanguage } from "@/features/i18n/LanguageProvider"


const tabMeta = [
  { icon: Rocket, color: "from-blue-500 to-cyan-500", bgPattern: "🚀" },
  { icon: Target, color: "from-purple-500 to-pink-500", bgPattern: "🎯" },
  { icon: Lightbulb, color: "from-amber-500 to-orange-500", bgPattern: "💡" },
  { icon: Users, color: "from-emerald-500 to-teal-500", bgPattern: "👥" },
  { icon: Zap, color: "from-violet-500 to-purple-500", bgPattern: "⚡" },
]

export default function About() {
  const [activeTab, setActiveTab] = useState(0)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dragX, setDragX] = useState(0)
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const { t } = useLanguage()
  const tabs = t.about.tabs.map((tab, index) => ({ ...tab, ...tabMeta[index] }))
  const text = t.about.ui

  // Auto-progresión para móvil (pausada cuando hay interacción)
  useEffect(() => {
    if (isMobile && expandedCard === null) {
      const interval = setInterval(() => {
        setActiveTab((prev) => (prev + 1) % tabs.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isMobile, expandedCard, tabs.length])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isMobile) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleTabHover = (index: number) => {
    if (!isMobile) {
      setActiveTab(index)
    }
  }

  const handleTabClick = (index: number) => {
    if (isMobile) {
      if (expandedCard === index) {
        setExpandedCard(null)
      } else {
        setActiveTab(index)
        setExpandedCard(index)
      }
    }
  }

  // Manejo de gestos de swipe
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    const velocity = info.velocity.x
    const offset = info.offset.x

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (offset > 0 || velocity > 0) {
        // Swipe hacia la derecha - ir al anterior
        setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length)
      } else {
        // Swipe hacia la izquierda - ir al siguiente
        setActiveTab((prev) => (prev + 1) % tabs.length)
      }
    }
    setDragX(0)
  }

  const handleDrag = (event: any, info: PanInfo) => {
    setDragX(info.offset.x)
  }

  return (
    <section
      className="relative min-h-screen flex items-center bg-background text-foreground overflow-hidden py-12 md:py-24 lg:py-32"
      id="about"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <NetworkBackground color={theme === "dark" ? "#64ffda" : "#0891b2"} density={60} />

      {/* Floating background elements - hidden on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, Math.random() * 0.5 + 0.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Interactive cursor glow - desktop only */}
      {!isMobile && (
        <motion.div
          className="absolute w-96 h-96 rounded-full pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle, ${
              theme === "dark" ? "rgba(100, 255, 218, 0.1)" : "rgba(8, 145, 178, 0.1)"
            } 0%, transparent 70%)`,
            x: mouseX,
            y: mouseY,
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      )}

      <ResponsiveContainer maxWidth="2xl" paddingX="lg">
        {/* Header with enhanced styling */}
        <motion.div
          className="text-center mb-8 md:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 md:mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>{text.eyebrow}</span>
          </motion.div>

          <ResponsiveText as="h2" size="6xl" weight="bold" className="mb-6 relative">
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Quiénes
            </span>
            <br />
            <span className="text-foreground">{text.title}</span>

            {/* Decorative elements - hidden on mobile */}
            {!isMobile && (
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 text-primary/60"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                ✨
              </motion.div>
            )}
          </ResponsiveText>

          <ResponsiveText as="p" size="xl" color="muted" className="max-w-3xl mx-auto leading-relaxed">
            Descubre la pasión, visión y compromiso que nos impulsa a crear soluciones digitales extraordinarias
          </ResponsiveText>
        </motion.div>

        {/* Mobile Layout */}
        {isMobile && (
          <div className="space-y-8 pb-16">
            {/* Auto-advancing Carousel */}
            <div className="relative overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeTab}
                  className="w-full" /* Removed px-4 */
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="bg-card/90 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-2xl overflow-hidden">
                    {/* Background decoration */}
                    <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${tabs[activeTab].color}`} />
                    <div className="absolute top-4 right-4 text-3xl opacity-20">{tabs[activeTab].bgPattern}</div>

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tabs[activeTab].color} text-white shadow-lg`}
                        >
                          {React.createElement(tabs[activeTab].icon, { className: "w-6 h-6" })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <ResponsiveText as="h3" size="2xl" weight="bold" className="mb-1 truncate">
                            {tabs[activeTab].title}
                          </ResponsiveText>
                          <p className="text-sm text-muted-foreground">
                            {activeTab + 1} {text.of} {tabs.length}
                          </p>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <ResponsiveText as="p" size="base" weight="medium" color="primary" className="text-center">
                          {tabs[activeTab].summary}
                        </ResponsiveText>
                      </div>

                      {/* Expandable content */}
                      <motion.div
                        initial={false}
                        animate={{ height: expandedCard === activeTab ? "auto" : 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4">
                          <ResponsiveText as="p" size="base" color="muted" className="leading-relaxed">
                            {tabs[activeTab].content}
                          </ResponsiveText>
                        </div>
                      </motion.div>

                      {/* Expand button */}
                      <button
                        onClick={() => handleTabClick(activeTab)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-medium">
                          {expandedCard === activeTab ? text.seeLess : text.seeMore}
                        </span>
                        {expandedCard === activeTab ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots - Espaciado aumentado significativamente */}
              <div className="flex justify-center items-center gap-4 sm:gap-5 mt-8 mb-8">
                {tabs.map((_, index) => (
                  <button
                    key={index}
                    className={`relative transition-all duration-300 ${
                      index === activeTab ? "scale-125" : "hover:scale-110"
                    }`}
                    onClick={() => setActiveTab(index)}
                    aria-label={`${text.seeMore} ${tabs[index].shortTitle}`}
                  >
                    <div
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                        index === activeTab ? "bg-primary shadow-lg shadow-primary/50" : "bg-muted hover:bg-primary/50"
                      }`}
                    />
                    {/* Indicador de progreso para el activo */}
                    {index === activeTab && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/30"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Navigation Grid - Espaciado aumentado */}
            <div className="grid grid-cols-3 gap-5 pt-4">
              {tabs.map((tab, index) => (
                <motion.button
                  key={index}
                  className={`p-5 rounded-xl border transition-all duration-300 text-left ${
                    index === activeTab
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border bg-card/50 hover:border-primary/50"
                  }`}
                  onClick={() => setActiveTab(index)}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        index === activeTab
                          ? `bg-gradient-to-br ${tab.color} text-white shadow-lg`
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {React.createElement(tab.icon, { className: "w-5 h-5" })}
                    </div>
                    <span className="text-xs font-medium text-foreground text-center leading-tight">
                      {tab.shortTitle}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Tablet and Desktop Layout */}
        {!isMobile && (
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* Interactive tabs section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Control panel */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <ResponsiveText as="h3" size="2xl" weight="bold" className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center text-white text-sm">
                    🎯
                  </span>
                  Explora nuestra esencia
                </ResponsiveText>
              </div>

              <div className="space-y-3">
                {tabs.map((tab, index) => {
                  const IconComponent = tab.icon
                  const isActive = activeTab === index

                  return (
                    <motion.div
                      key={index}
                      className={`group relative p-4 md:p-6 rounded-2xl transition-all duration-500 overflow-hidden cursor-pointer ${
                        isActive
                          ? "bg-card/90 border-2 border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                          : "bg-card/50 border border-border hover:bg-card/70 hover:border-primary/50"
                      }`}
                      onMouseEnter={() => handleTabHover(index)}
                      whileHover={{ y: -2 }}
                      layout
                    >
                      {/* Background gradient */}
                      <div
                        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${tab.color}`}
                      />

                      {/* Background pattern */}
                      <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                        {tab.bgPattern}
                      </div>

                      <div className="relative z-10 flex items-center gap-4">
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? `bg-gradient-to-br ${tab.color} text-white shadow-lg`
                              : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                          }`}
                        >
                          <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-bold text-base md:text-lg transition-colors duration-300 truncate ${
                              isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                            }`}
                          >
                            {tab.title}
                          </h4>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {isActive ? text.selected : text.preview}
                          </p>
                        </div>

                        <motion.div
                          className={`transition-all duration-300 ${
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                          }`}
                          animate={{
                            x: isActive ? 5 : 0,
                            rotate: isActive ? [0, 10, 0] : 0,
                          }}
                          transition={{
                            rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                          }}
                        >
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.div>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-primary/70 rounded-r"
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Enhanced progress indicator */}
              <div className="mt-6 md:mt-8 p-3 md:p-4 bg-card/30 rounded-xl">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <span className="text-xs md:text-sm text-muted-foreground">{text.exploration}</span>
                  <span className="text-xs text-muted-foreground">
                    {activeTab + 1} {text.of} {tabs.length}
                  </span>
                </div>

                <div className="flex gap-2">
                  {tabs.map((_, index) => (
                    <div key={index} className="flex-1 h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full transition-all duration-300 ${
                          index === activeTab ? "bg-primary" : index < activeTab ? "bg-primary/50" : "bg-transparent"
                        }`}
                        initial={{ width: "0%" }}
                        animate={{
                          width: index <= activeTab ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.1, ease: "linear" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Content display section */}
            <motion.div
              className={`${isTablet ? "" : "sticky top-24"}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative"
                >
                  {/* Main content card */}
                  <div className="relative bg-card/90 backdrop-blur-xl border border-border rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
                    {/* Background decoration */}
                    <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${tabs[activeTab].color}`} />

                    <div className="absolute top-6 right-6 text-4xl md:text-6xl opacity-10">
                      {tabs[activeTab].bgPattern}
                    </div>

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <div
                          className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tabs[activeTab].color} text-white shadow-lg`}
                        >
                          {React.createElement(tabs[activeTab].icon, { className: "w-6 h-6 md:w-8 md:h-8" })}
                        </div>
                        <div>
                          <ResponsiveText as="h3" size="3xl" weight="bold" className="mb-1">
                            {tabs[activeTab].title}
                          </ResponsiveText>
                          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                            <motion.div
                              className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            />
                            <span>{text.exploreHint}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="prose prose-lg max-w-none">
                        <ResponsiveText as="p" size="lg" color="muted" className="leading-relaxed">
                          {tabs[activeTab].content}
                        </ResponsiveText>
                      </div>

                      {/* Status indicator */}
                      <motion.div
                        className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-border/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs md:text-sm font-medium text-foreground">{text.manual}</p>
                              <p className="text-xs text-muted-foreground">
                                {text.exploreHint}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs md:text-sm font-medium text-primary">
                              {activeTab + 1}/{tabs.length}
                            </p>
                            <p className="text-xs text-muted-foreground">{text.sections}</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute -top-4 -left-4 w-6 h-6 md:w-8 md:h-8 bg-primary/20 rounded-full blur-sm"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-4 h-4 md:w-6 md:h-6 bg-primary/30 rounded-full blur-sm"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </ResponsiveContainer>
    </section>
  )
}
