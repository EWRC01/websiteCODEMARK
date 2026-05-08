"use client"
import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import NetworkBackground from "@/shared/backgrounds/NetworkBackground"
import { useTheme } from "@/app/theme-provider"
import { AnimatedList } from "@/components/ui/animated-list"
import { cn } from "@/lib/utils"
import { ResponsiveContainer } from "@/components/ui/responsive-container" // Import ResponsiveContainer
import { ResponsiveText } from "@/components/ui/responsive-text" // Import ResponsiveText
import { useMediaQuery } from "@/hooks/media/useMediaQuery"
import { useLanguage } from "@/features/i18n/LanguageProvider"

interface ValueItem {
  name: string
  description: string
  icon: string
  color: string
  time: string
}

export default function Values() {
  const { theme } = useTheme()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isTablet = useMediaQuery("(max-width: 1023px)")
  const { t } = useLanguage()

  const valueMeta = [
    { icon: "👁️", color: "#8b5cf6" },
    { icon: "🤝", color: "#06b6d4" },
    { icon: "💬", color: "#ec4899" },
    { icon: "🚀", color: "#f59e0b" },
    { icon: "🛡️", color: "#6366f1" },
    { icon: "💡", color: "#14b8a6" },
  ]

  const text = t.values
  const values = text.items.map((value, index) => ({ ...value, ...valueMeta[index] }))

  const ValueNotification = ({ name, description, icon, color, time }: ValueItem) => {
    return (
      <figure
        className={cn(
          "relative mx-auto min-h-fit w-full rounded-2xl p-4", // Removed max-w-[400px]
          // animation styles
          "transition-all duration-200 ease-in-out hover:scale-[103%]",
          // light styles
          "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
          // dark styles
          "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        )}
      >
        <div className="flex flex-row items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: color,
            }}
          >
            <span className="text-lg">{icon}</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <figcaption className="flex flex-row items-center whitespace-normal text-sm sm:text-lg font-medium dark:text-white">
              {" "}
              {/* Changed text-lg to text-sm sm:text-lg, removed whitespace-pre */}
              <span className="truncate">{name}</span> {/* Added truncate */}
              <span className="mx-1">·</span>
              <span className="text-xs text-gray-500">{time}</span>
            </figcaption>
            <p className="text-xs sm:text-sm font-normal dark:text-white/60 line-clamp-2">{description}</p>{" "}
            {/* Changed text-sm to text-xs sm:text-sm, added line-clamp-2 */}
          </div>
        </div>
      </figure>
    )
  }

  return (
    <section
      className="relative min-h-screen flex items-center bg-background text-foreground overflow-hidden py-24"
      id="values"
    >
      <NetworkBackground color={theme === "dark" ? "#48cae4" : "#0e7490"} density={50} />

      <ResponsiveContainer maxWidth="2xl" paddingX="lg">
        {" "}
        {/* Ensure ResponsiveContainer is used */}
        <motion.h2
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ResponsiveText as="span" size="4xl" weight="bold" color="primary" className="block">
            {" "}
            {/* Changed size to 4xl */}
            {text.title}
          </ResponsiveText>
        </motion.h2>
        <motion.p
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ResponsiveText as="span" size="lg" color="muted" className="block">
            {" "}
            {/* Changed size to lg */}
            {text.subtitle}
          </ResponsiveText>
        </motion.p>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Animated List */}
          <div className="flex-1 w-full max-w-sm sm:max-w-md mx-auto">
            {" "}
            {/* Adjusted max-w for better mobile fit */}
            <div className="relative flex h-[500px] w-full flex-col overflow-hidden p-2">
              <AnimatedList delay={2000}>
                {values.map((item, idx) => (
                  <ValueNotification {...item} key={idx} />
                ))}
              </AnimatedList>

              {/* Gradient fade effect */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
            </div>
          </div>

          {/* Visual Element - Hidden on Mobile and Tablet */}
          {!isMobile && !isTablet && (
            <div className="flex-1 flex justify-center items-center">
              <motion.div
                className="relative w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="w-60 h-60 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield size={64} className="text-primary" />
                  </div>
                </div>

                {/* Floating icons */}
                {values.slice(0, 4).map((value, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: value.color,
                      top: `${20 + Math.sin((index * Math.PI) / 2) * 30}%`,
                      left: `${20 + Math.cos((index * Math.PI) / 2) * 30}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    {value.icon}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </ResponsiveContainer>
    </section>
  )
}
