"use client"
import { motion } from "framer-motion"
import { ResponsiveText } from "@/components/ui/responsive-text"
import TechStackCategoryNavigation from "./TechStackCategoryNavigation"
import TechStackCategoryDetails from "./TechStackCategoryDetails"
import type React from "react"
import { useLanguage } from "@/features/i18n/LanguageProvider"

interface CategoryInfo {
  icon: React.ElementType
  title: string
  description: string
  color: string
}

interface Technology {
  name: string
  icon: string
}

interface TechStackDesktopCategoriesProps {
  activeCategory: string
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>
  categories: string[]
  categoryInfo: { [key: string]: CategoryInfo }
  technologies: { [key: string]: Technology[] }
  currentSlide: number
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>> // Corregido el tipo aquí
  handleCategoryClick: (category: string, index: number) => void
  handleCategoryHover: (category: string) => void
  isInView: boolean // Passed from parent for initial animation
}

export default function TechStackDesktopCategories({
  activeCategory,
  setActiveCategory,
  categories,
  categoryInfo,
  technologies,
  currentSlide,
  setCurrentSlide,
  handleCategoryClick,
  handleCategoryHover,
  isInView,
}: TechStackDesktopCategoriesProps) {
  const { t } = useLanguage()
  const text = t.techStack.desktop

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="order-1 lg:order-2"
    >
      <div className="mb-8">
        <ResponsiveText as="h3" size="3xl" weight="bold" className="mb-4 text-center lg:text-left">
          {text.title}
        </ResponsiveText>
        <p className="text-muted-foreground text-center lg:text-left">
          {text.subtitle}
        </p>
      </div>

      {/* Este componente ya maneja la renderización de los botones de categoría para desktop */}
      <TechStackCategoryNavigation
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        isMobile={false} // Forzar a false para desktop
        isTablet={false} // Forzar a false para desktop
        categories={categories}
        categoryInfo={categoryInfo}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        handleCategoryClick={handleCategoryClick}
        handleCategoryHover={handleCategoryHover}
      />

      {/* Este componente muestra los detalles de la categoría activa */}
      <TechStackCategoryDetails
        activeCategory={activeCategory}
        technologies={technologies}
        categoryInfo={categoryInfo}
        isMobile={false} // Forzar a false para desktop
        isTablet={false} // Forzar a false para desktop
      />
    </motion.div>
  )
}
