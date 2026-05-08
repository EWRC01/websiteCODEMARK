"use client"
import Particles from "@tsparticles/react"
import type { Engine, ISourceOptions } from "@tsparticles/engine"
import { useTheme } from "@/app/theme-provider"

interface NetworkBackgroundProps {
  className?: string
  color?: string
  linesColor?: string
  interactive?: boolean
  density?: number
  id?: string // Agregado para flexibilidad, opcional
}

export default function NetworkBackground({
  className = "",
  color = "#64ffda",
  linesColor = "#64ffda",
  interactive = true,
  density = 80,
  id = "tsparticles-network-bg", // ID FIJO por default
}: NetworkBackgroundProps) {
  const { theme } = useTheme()

  // Ajustar colores automáticamente según el tema si no se especifican
  const themeAwareColor = color === "#64ffda" ? (theme === "dark" ? "#64ffda" : "#0891b2") : color
  const themeAwareLinesColor = linesColor === "#64ffda" ? (theme === "dark" ? "#64ffda" : "#0891b2") : linesColor

  // Ya no es necesario el particlesInit ni el loadSlim

  const options: ISourceOptions = {
    fullScreen: { enable: false },
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: interactive,
          mode: "push",
        },
        onHover: {
          enable: interactive,
          mode: "repulse",
        },
       
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 150,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: themeAwareColor,
      },
      links: {
        color: themeAwareLinesColor,
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
         
        },
        value: density,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  }

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <Particles id={id} options={options} />
    </div>
  )
}
