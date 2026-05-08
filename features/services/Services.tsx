"use client"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { ServiceCard } from "./components/ServiceCard"
import { useLanguage } from "@/features/i18n/LanguageProvider"

const serviceMeta = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pc-KNBUR4C3FOMOWSBhrlYFFfBLZ8z86j.png",
    color: "from-blue-500 to-cyan-500",
    icon: "💻",
    category: "web",
    featured: true,
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ciber-b0l8wgBU8LBHSTyGXbTN2lsGo5YvDC.png",
    color: "from-purple-500 to-indigo-500",
    icon: "🔒",
    category: "security",
    featured: true,
  },
  {
    image: "/images/ai-automation.png",
    color: "from-emerald-500 to-green-500",
    icon: "🤖",
    category: "automation",
    featured: false,
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mante-0kuzNJCUTbAPH91sVYUUgLW0aMxBM0.png",
    color: "from-amber-500 to-orange-500",
    icon: "⚡",
    category: "performance",
    featured: false,
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mar-QxMQVCK6F2VSorxswBEbTQFu7RTsqT.png",
    color: "from-pink-500 to-rose-500",
    icon: "📈",
    category: "marketing",
    featured: false,
  },
  {
    image: "/images/consulting.png",
    color: "from-violet-500 to-purple-500",
    icon: "🔍",
    category: "consulting",
    featured: false,
  },
  {
    image: "/images/consulting.png",
    color: "from-cyan-500 to-blue-500",
    icon: "🧾",
    category: "electronic-invoicing",
    featured: false,
  },
]

export default function Services() {
  const { t } = useLanguage()
  const text = t.services
  const services = text.items.map((service, index) => ({ ...service, ...serviceMeta[index] }))

  return (
    <section
      className="relative min-h-screen py-16 md:py-24 lg:py-32 bg-background text-foreground overflow-hidden"
      id="services"
    >
      <ResponsiveContainer maxWidth="2xl" paddingX="lg">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <ResponsiveText as="h2" size="5xl" weight="bold" color="primary" className="mb-4">
            {text.title}
          </ResponsiveText>
          <ResponsiveText as="p" size="xl" color="muted" className="max-w-3xl mx-auto">
            {text.subtitle}
          </ResponsiveText>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const isLastOddCard = index === services.length - 1 && services.length % 2 !== 0
            const isLastDesktopRemainder = index === services.length - 1 && services.length % 3 === 1

            return (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
                className={`${isLastOddCard ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc((100%_-_2rem)/2)]" : ""} ${
                  isLastDesktopRemainder ? "lg:col-span-1 lg:col-start-2 lg:max-w-none" : ""
                }`}
              />
            )
          })}
        </div>
      </ResponsiveContainer>
    </section>
  )
}
