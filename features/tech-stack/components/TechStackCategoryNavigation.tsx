"use client"
import { motion } from "framer-motion"
import type React from "react"

import { cn } from "@/lib/utils"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { useEffect } from "react"
import { useLanguage } from "@/features/i18n/LanguageProvider"

interface CategoryInfo {
  icon: React.ElementType
  title: string
  description: string
  color: string
}

interface TechStackCategoryNavigationProps {
  activeCategory: string
  setActiveCategory: React.Dispatch<React.SetStateAction<string>> // Corregido el tipo aquí
  isMobile: boolean
  isTablet: boolean
  categories: string[]
  categoryInfo: { [key: string]: CategoryInfo }
  currentSlide: number
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>> // Corregido el tipo aquí
  handleCategoryClick: (category: string, index: number) => void
  handleCategoryHover: (category: string) => void
}

export default function TechStackCategoryNavigation({
  activeCategory,
  setActiveCategory,
  isMobile,
  isTablet,
  categories,
  categoryInfo,
  currentSlide,
  setCurrentSlide,
  handleCategoryClick,
  handleCategoryHover,
}: TechStackCategoryNavigationProps) {
  const { t } = useLanguage()
  const text = t.techStack.navigation

  // Auto-progresión para móvil sincronizada y sin errores de tipo
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          // 'prev' ya es de tipo 'number' por el tipo de setCurrentSlide
          const next = (prev + 1) % categories.length
          setActiveCategory(categories[next])
          return next
        })
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isMobile, categories, setActiveCategory, setCurrentSlide])

  if (isMobile) {
    return (
      <div className="relative">
        {/* Header con información de la categoría actual */}
        <div className="text-center mb-6">
          <ResponsiveText as="h3" size="xl" weight="bold" color="primary" className="mb-2">
            {categoryInfo[activeCategory as keyof typeof categoryInfo].title}
          </ResponsiveText>
          <p className="text-sm text-muted-foreground mb-1">
            {categoryInfo[activeCategory as keyof typeof categoryInfo].description}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentSlide + 1} {text.of} {categories.length} {text.categories}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {categories.map((_, index) => (
            <button
              key={index}
              className={`relative transition-all duration-300 ${
                index === currentSlide ? "scale-125" : "hover:scale-110"
              }`}
              onClick={() => {
                setCurrentSlide(index)
                setActiveCategory(categories[index])
              }}
              aria-label={`${text.viewCategory} ${categoryInfo[categories[index] as keyof typeof categoryInfo].title}`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-primary shadow-lg shadow-primary/50" : "bg-muted hover:bg-primary/50"
                }`}
              />
              {index === currentSlide && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Quick category navigation */}
        <div className="grid grid-cols-4 gap-3 mt-8">
          {categories.slice(0, 4).map((category, index) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category, index)}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                category === activeCategory
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/30 hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    category === activeCategory
                      ? `bg-gradient-to-br ${categoryInfo[category as keyof typeof categoryInfo].color} text-white`
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {(() => {
                    const IconComponent = categoryInfo[category as keyof typeof categoryInfo].icon
                    return <IconComponent className="w-4 h-4" />
                  })()}
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {categoryInfo[category as keyof typeof categoryInfo].title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Indicador de auto-progresión */}
        <div className="text-center mt-6">
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <motion.div
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <span>{text.auto}</span>
          </div>
        </div>
      </div>
    )
  }

  if (isTablet) {
    return (
      <div className="grid grid-cols-2 gap-4 mb-8">
        {Object.entries(categoryInfo).map(([category, info]) => {
          const IconComponent = info.icon
          const isActive = activeCategory === category

          return (
            <motion.button
              key={category}
              className={cn(
                "group relative p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden",
                Object.keys(categoryInfo).length % 2 === 1 &&
                  Object.keys(categoryInfo).indexOf(category) === Object.keys(categoryInfo).length - 1 &&
                  "col-span-2 mx-auto w-full max-w-[calc((100%_-_1rem)/2)]",
                isActive
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5",
              )}
              onClick={() => setActiveCategory(category)}
              onMouseEnter={() => handleCategoryHover(category)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Object.keys(categoryInfo).indexOf(category) * 0.1 }}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
                  info.color,
                  isActive ? "opacity-10" : "group-hover:opacity-5",
                )}
              ></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={cn(
                      "p-3 rounded-lg transition-colors duration-300",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary",
                    )}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <ResponsiveText
                      as="span"
                      size="lg"
                      weight="semibold"
                      className={cn("transition-colors duration-300", isActive ? "text-primary" : "text-foreground")}
                    >
                      {info.title}
                    </ResponsiveText>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
              </div>
            </motion.button>
          )
        })}
      </div>
    )
  }

  // Desktop Layout
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
      {Object.entries(categoryInfo).map(([category, info]) => {
        const IconComponent = info.icon
        const isActive = activeCategory === category

        return (
          <motion.button
            key={category}
            className={cn(
              "group relative p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden",
              Object.keys(categoryInfo).length % 2 === 1 &&
                Object.keys(categoryInfo).indexOf(category) === Object.keys(categoryInfo).length - 1 &&
                "lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-[calc((100%_-_1rem)/2)]",
              Object.keys(categoryInfo).length % 3 === 1 &&
                Object.keys(categoryInfo).indexOf(category) === Object.keys(categoryInfo).length - 1 &&
                "xl:col-span-1 xl:col-start-2 xl:max-w-none",
              isActive
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                : "border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5",
            )}
            onClick={() => setActiveCategory(category)}
            onMouseEnter={() => handleCategoryHover(category)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
                info.color,
                isActive ? "opacity-10" : "group-hover:opacity-5",
              )}
            ></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary",
                  )}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "font-semibold transition-colors duration-300",
                    isActive ? "text-primary" : "text-foreground",
                  )}
                >
                  {info.title}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
