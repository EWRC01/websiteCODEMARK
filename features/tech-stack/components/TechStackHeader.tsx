"use client"
import { motion } from "framer-motion"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { useLanguage } from "@/features/i18n/LanguageProvider"

interface TechStackHeaderProps {
  isInView: boolean
}

export default function TechStackHeader({ isInView }: TechStackHeaderProps) {
  const { t } = useLanguage()
  const text = t.techStack.header

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-8 md:mb-12 lg:mb-16"
      transition={{ duration: 0.6 }}
    >
      <ResponsiveText as="h2" size="5xl" weight="bold" color="primary" className="mb-4 md:mb-6">
        {text.title}
      </ResponsiveText>
      <ResponsiveText as="p" size="xl" color="muted" className="max-w-3xl mx-auto">
        {text.subtitle}
      </ResponsiveText>
    </motion.div>
  )
}
