"use client"

import Image from "next/image"
import type { ServiceProps } from "../types"
import { useMotionValue, useSpring, useTransform, AnimatePresence, motion } from "framer-motion" // Added motion, AnimatePresence, useTransform
import { useIsMobile } from "@/hooks/useBreakpoint"
import { cn } from "@/lib/utils"
import type React from "react"
import { useRef, useState } from "react"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { ArrowRight } from "lucide-react" // Added ArrowRight icon
import { useLanguage } from "@/features/i18n/LanguageProvider"

interface ServiceCardProps {
  service: ServiceProps & { details: string[]; icon: string; color: string }
  index: number
  activeSlide?: number
  className?: string
}

export function ServiceCard({ service, index, activeSlide, className }: ServiceCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }) // Re-added mousePosition state
  const isMobile = useIsMobile()
  const isActive = isMobile && activeSlide === index // Determine if this card is the active one in mobile
  const { t } = useLanguage()
  const text = t.services.card

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (!cardRef.current) return
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    x.set(clientX - left - width / 2)
    y.set(clientY - top - height / 2)

    // Guardar posición del mouse para el popover
    setMousePosition({ x: clientX - left, y: clientY - top }) // Re-added mousePosition update
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  function onMouseEnter() {
    setIsHovered(true)
  }

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5])
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5])

  return (
    <motion.div
      ref={cardRef}
      className={cn("group relative h-[350px] sm:h-[380px] md:h-[400px]", className)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        perspective: 1000,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <motion.div
        className={cn(
          "relative w-full h-full bg-card/80 backdrop-blur-md border rounded-2xl overflow-hidden shadow-lg transition-all duration-500",
          (isHovered && !isMobile) || isActive ? "shadow-2xl shadow-primary/20 border-primary/50" : "border-border", // Use isActive for mobile default
        )}
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Gradient background */}
        <div
          className={cn(
            `absolute inset-0 transition-opacity duration-500 bg-gradient-to-br ${service.color}`,
            (isHovered && !isMobile) || isActive ? "opacity-15" : "opacity-0", // Use isActive for mobile default
          )}
        ></div>

        {/* Service icon */}
        <div className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl rounded-full bg-gradient-to-br opacity-90 shadow-lg z-10 transition-transform duration-300 group-hover:scale-110">
          <div
            className={`w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br ${service.color}`}
          >
            <span>{service.icon}</span>
          </div>
        </div>

        {/* Image container with gradient overlay */}
        <div className="relative w-full h-40 sm:h-44 md:h-48 overflow-hidden">
          <Image
            src={service.image || "/placeholder.svg"}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div
            className={`absolute inset-0 opacity-60 bg-gradient-to-t from-black/80 via-black/40 to-transparent`}
          ></div>

          {/* Title overlay on image - now always visible at the top */}
          <div className="absolute top-0 left-0 w-full p-4 sm:p-6">
            <ResponsiveText as="h3" size="xl" weight="bold" color="default" className="text-white drop-shadow-md">
              {service.title}
            </ResponsiveText>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 pt-8 sm:pt-10 h-full flex flex-col">
          <ResponsiveText as="p" size="base" color="muted" className="leading-relaxed mb-4 flex-1">
            {service.description}
          </ResponsiveText>

          {/* Hover indicator */}
          <div className="flex items-center gap-2 text-primary/70 text-xs sm:text-sm transition-opacity duration-300 group-hover:opacity-0">
            <span>{text.hover}</span>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.div>
          </div>
        </div>

        {/* Hover effect - shine */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent blur-sm"></div>
        </div>

        {/* Animated border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.color} opacity-20 blur-sm`}></div>
        </div>
      </motion.div>

      {/* Popover emergente */}
      <AnimatePresence>
        {isHovered && !isMobile && (
          <motion.div
            className="absolute z-50 pointer-events-none"
            style={{
              left: mousePosition.x > 200 ? mousePosition.x - 320 : mousePosition.x + 20,
              top: mousePosition.y > 300 ? mousePosition.y - 280 : mousePosition.y + 20,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Flecha del popover */}
              <div
                className={`absolute w-3 h-3 bg-card border-l border-t border-border transform rotate-45 ${
                  mousePosition.x > 200 ? "right-4 top-6" : "left-4 top-6"
                }`}
              ></div>

              {/* Contenido del popover */}
              <div className="bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl shadow-black/20 p-4 sm:p-6 w-72 sm:w-80 max-w-sm">
                {/* Header del popover */}
                <div className="flex items-center gap-3 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-border/50">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${service.color}`}
                  >
                    <span className="text-base sm:text-lg">{service.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <ResponsiveText as="h4" size="lg" weight="bold" className="leading-tight truncate">
                      {service.title}
                    </ResponsiveText>
                    <p className="text-xs text-muted-foreground">{text.included}</p>
                  </div>
                </div>

                {/* Lista de detalles */}
                <div className="space-y-2 sm:space-y-3 mb-2 sm:mb-3">
                  {service.details.map((detail, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      className="flex items-start gap-2 sm:gap-3 group/item"
                    >
                      <motion.div
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br ${service.color} mt-1.5 flex-shrink-0`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      ></motion.div>
                      <span className="text-xs sm:text-sm text-muted-foreground group-hover/item:text-foreground transition-colors duration-200">
                        {detail}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Indicador de cierre */}
                <div className="flex items-center justify-center mt-2 pt-2 sm:pt-3 border-t border-border/30">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>{text.close}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
