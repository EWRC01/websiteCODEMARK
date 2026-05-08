"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Linkedin, Twitter } from "lucide-react"
import gsap from "gsap"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { ResponsiveContainer } from "@/components/ui/responsive-container" // Import ResponsiveContainer
import { useLanguage } from "@/features/i18n/LanguageProvider"

type TeamMember = {
  name: string
  role: string
  image: string
  bio: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

const teamMemberMeta: Array<Pick<TeamMember, "image" | "socialLinks">> = [
  {
    image: "/images/team/2.svg",
    socialLinks: {
      github: "https://github.com/EWRC01",
      linkedin: "https://linkedin.com/in/ewrc01",
    },
  },
  {
    image: "/images/team/1.svg",
    socialLinks: {
      github: "https://github.com/Ltomxd",
      linkedin: "https://www.linkedin.com/in/ftoml/",
    },
  },
  {
    image: "/images/team/3.svg",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/adonay-arag%C3%B3n05/",
      github: "https://github.com/Adonay117",
    },
  },
]

export default function OurTeam() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()
  const teamMembers = t.team.members.map((member, index) => ({ ...member, ...teamMemberMeta[index] }))
  const text = t.team

  useEffect(() => {
    if (!isTransitioning) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % teamMembers.length)
      }, 8000)
      return () => clearInterval(interval)
    }
  }, [isTransitioning, teamMembers.length])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setCursorPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const animateParticle = useCallback((particle: HTMLDivElement) => {
    gsap.to(particle, {
      duration: Math.random() * 3 + 2,
      y: "-=20",
      x: Math.random() * 20 - 10,
      scale: Math.random() * 0.3 + 0.7,
      opacity: Math.random() * 0.5 + 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.easeInOut",
      onComplete: () => {
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * 500,
        })
      },
    })
  }, [])

  useEffect(() => {
    if (!particlesRef.current) return

    const particles = Array.from({ length: 30 }).map(() => {
      const particle = document.createElement("div")
      particle.className = "absolute w-1 h-1 rounded-full bg-primary/50 blur-[1px]"
      return particle
    })

    particles.forEach((particle) => {
      if (particlesRef.current) {
        particlesRef.current.appendChild(particle)
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * 500,
          scale: Math.random() * 0.5 + 0.5,
        })
        animateParticle(particle)
      }
    })

    return () => {
      if (particlesRef.current) {
        while (particlesRef.current.firstChild) {
          particlesRef.current.removeChild(particlesRef.current.firstChild)
        }
      }
    }
  }, [animateParticle])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-background text-foreground py-16 md:py-24 lg:py-32" // Adjusted padding
      id="team"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 pointer-events-none z-0" ref={particlesRef}></div>

      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, rgba(100, 255, 218, 0.15) 0%, transparent 50%)`,
        }}
      />

      <ResponsiveContainer maxWidth="2xl" paddingX="lg">
        {" "}
        {/* Using ResponsiveContainer for consistent padding */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 pt-16" // Añadido pt-16 aquí
        >
          <ResponsiveText as="h2" size="5xl" weight="bold" color="primary" className="mb-4">
            {text.title}
          </ResponsiveText>
          <ResponsiveText as="p" size="xl" color="muted">
            {text.subtitle}
          </ResponsiveText>
        </motion.div>
        <div className="flex justify-center items-center perspective-[2000px] min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="flex flex-col lg:flex-row gap-16 items-center max-w-5xl mx-auto bg-card/90 backdrop-blur-md border border-border shadow-lg rounded-3xl p-8 md:p-12" // Adjusted padding
              initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 100,
              }}
              onAnimationStart={() => setIsTransitioning(true)}
              onAnimationComplete={() => setIsTransitioning(false)}
            >
              <motion.div
                className="flex-shrink-0 transform-style-3d"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-2xl overflow-hidden transform-style-3d">
                  {" "}
                  {/* Adjusted size */}
                  <Image
                    src={teamMembers[activeIndex].image || "/placeholder.svg"}
                    alt={teamMembers[activeIndex].name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover filter contrast-110 brightness-110 transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute -inset-0.5 rounded-[22px] bg-gradient-to-br from-primary to-primary/70 -z-10 opacity-50 blur-md animate-pulse"></div>
                </div>
              </motion.div>

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative mb-4"
                >
                  <ResponsiveText
                    as="h3"
                    size="4xl"
                    weight="bold"
                    className="mb-2 drop-shadow-[0_0_20px_rgba(100,255,218,0.3)]"
                  >
                    {teamMembers[activeIndex].name}
                  </ResponsiveText>
                  <div className="absolute bottom-[-5px] left-0 w-[50px] h-[3px] bg-gradient-to-r from-primary to-transparent animate-[expandLine_0.8s_forwards]"></div>
                </motion.div>

                <ResponsiveText
                  as="p"
                  size="xl"
                  weight="medium"
                  color="primary"
                  className="mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-px after:bg-gradient-to-r after:from-primary after:to-transparent"
                >
                  {teamMembers[activeIndex].role}
                </ResponsiveText>

                <ResponsiveText as="p" size="lg" color="default" className="leading-relaxed mb-8">
                  {teamMembers[activeIndex].bio}
                </ResponsiveText>

                <motion.div
                  className="flex gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {teamMembers[activeIndex].socialLinks.github && (
                    <motion.a
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      href={teamMembers[activeIndex].socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary relative overflow-hidden transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 opacity-0 transition-opacity duration-300 hover:opacity-20"></span>
                      <Github className="relative z-10" />
                    </motion.a>
                  )}
                  {teamMembers[activeIndex].socialLinks.linkedin && (
                    <motion.a
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      href={teamMembers[activeIndex].socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary relative overflow-hidden transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 opacity-0 transition-opacity duration-300 hover:opacity-20"></span>
                      <Linkedin className="relative z-10" />
                    </motion.a>
                  )}
                  {teamMembers[activeIndex].socialLinks.twitter && (
                    <motion.a
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      href={teamMembers[activeIndex].socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary relative overflow-hidden transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 opacity-0 transition-opacity duration-300 hover:opacity-20"></span>
                      <Twitter className="relative z-10" />
                    </motion.a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Indicadores mejorados con mejor espaciado */}
        <div className="flex justify-center items-center gap-6 md:gap-8 mt-12 px-4 mb-16">
          {teamMembers.map((_, index) => (
            <motion.button
              key={index}
              className={`relative transition-all duration-300 ${
                index === activeIndex ? "scale-125" : "hover:scale-110"
              }`}
              onClick={() => !isTransitioning && setActiveIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`${text.viewProfile} ${teamMembers[index].name}`}
            >
              <div
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-primary shadow-lg shadow-primary/50" : "bg-primary/30 hover:bg-primary/60"
                }`}
              />
              {/* Indicador de progreso para el activo */}
              {index === activeIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{ scale: [1, 1.6, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </ResponsiveContainer>

      <style jsx global>{`
        @keyframes expandLine {
          from { width: 0; }
          to { width: 50px; }
        }
        
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .perspective-[2000px] {
          perspective: 2000px;
        }
      `}</style>
    </section>
  )
}
