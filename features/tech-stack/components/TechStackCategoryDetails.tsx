"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ResponsiveText } from "@/components/ui/responsive-text"
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

interface TechStackCategoryDetailsProps {
  activeCategory: string
  technologies: { [key: string]: Technology[] }
  categoryInfo: { [key: string]: CategoryInfo }
  isMobile: boolean
  isTablet: boolean
}

export default function TechStackCategoryDetails({
  activeCategory,
  technologies,
  categoryInfo,
  isMobile,
  isTablet,
}: TechStackCategoryDetailsProps) {
  const { t } = useLanguage()
  const technologiesLabel = t.techStack.details.technologies

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className={cn(
              "p-4 rounded-xl bg-gradient-to-br",
              categoryInfo[activeCategory as keyof typeof categoryInfo].color,
            )}
          >
            {(() => {
              const IconComponent = categoryInfo[activeCategory as keyof typeof categoryInfo].icon
              return <IconComponent className="w-7 h-7 text-white" />
            })()}
          </div>
          <div>
            <ResponsiveText as="h4" size="2xl" weight="bold">
              {categoryInfo[activeCategory as keyof typeof categoryInfo].title}
            </ResponsiveText>
            <p className="text-muted-foreground">
              {technologies[activeCategory as keyof typeof technologies].length} {technologiesLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {technologies[activeCategory as keyof typeof technologies].map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                <img
                  src={tech.icon || "/placeholder.svg"}
                  alt={tech.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0 flex-1">
                <ResponsiveText
                  as="h5"
                  size="base"
                  weight="medium"
                  className="truncate group-hover:text-primary transition-colors duration-300"
                >
                  {tech.name}
                </ResponsiveText>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
