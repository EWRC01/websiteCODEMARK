"use client"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { ResponsiveText } from "@/components/ui/responsive-text"

// Importar IconCloud dinámicamente con ssr: false
const IconCloud = dynamic(() => import("@/components/ui/icon-cloud"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[280px] md:h-[350px] lg:min-h-[400px] text-muted-foreground">
      Cargando iconos...
    </div>
  ),
})

interface TechStackIconCloudProps {
  isInView: boolean
  isMobile: boolean
  isTablet: boolean
  iconSlugs: string[]
}

export default function TechStackIconCloud({ isInView, isMobile, isTablet, iconSlugs }: TechStackIconCloudProps) {
  // No necesitamos el estado 'mounted' aquí, ya que dynamic con ssr: false lo maneja.
  // El estado 'mounted' se ha movido al componente IconCloudComponent si es necesario para la librería interna.

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={isMobile ? "text-center" : "order-2 lg:order-1"}
      transition={{ duration: 0.8 }}
    >
      {!isMobile && !isTablet && (
        <div className="sticky top-24">
          <div className="text-center lg:text-left mb-8">
            <ResponsiveText as="h3" size="3xl" weight="bold" className="mb-4">
              Tecnologías en Acción
            </ResponsiveText>
            <p className="text-muted-foreground">
              Explora nuestro stack tecnológico de forma interactiva. Cada icono representa una herramienta que
              dominamos.
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <div
          className={
            isMobile
              ? "absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-2xl blur-2xl"
              : "absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-3xl"
          }
        ></div>
        <div
          className={
            isMobile
              ? "relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl"
              : "relative bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-6 lg:p-8"
          }
        >
          <div
            className={
              isMobile
                ? "flex items-center justify-center h-[280px]"
                : "flex items-center justify-center h-[350px] lg:min-h-[400px]"
            }
          >
            <IconCloud iconSlugs={iconSlugs} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
