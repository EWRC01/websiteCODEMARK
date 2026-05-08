"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useInView } from "framer-motion"
import { Database, Layout, Server, Cloud, ShoppingCart, Shield, Globe } from "lucide-react"
import { NetworkBackground } from "@/components/ui/backgrounds/network-background"
import { useTheme } from "@/app/theme-provider"
import { useIsMobile, useIsTablet } from "@/hooks/useBreakpoint"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import TechStackHeader from "./components/TechStackHeader"
import TechStackIconCloud from "./components/TechStackIconCloud"
import TechStackCategoryNavigation from "./components/TechStackCategoryNavigation"
import TechStackCategoryDetails from "./components/TechStackCategoryDetails"
import TechStackDesktopCategories from "./components/TechStackDesktopCategories" // New import
import { useLanguage } from "@/features/i18n/LanguageProvider"

const technologies = {
  backend: [
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  ],
  frontend: [
    {
      name: "JavaScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    { name: "Angular", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    {
      name: "TypeScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    },
  ],
  database: [
    {
      name: "PostgreSQL",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  ],
  devops: [
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "Kubernetes", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
    { name: "Jenkins", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
  ],
  ecommerce: [
    { name: "Shopify", icon: "https://cdn.worldvectorlogo.com/logos/shopify.svg" },
    {
      name: "WooCommerce",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-original.svg",
    },
    { name: "Magento", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/magento/magento-original.svg" },
  ],
  cms: [
    { name: "WordPress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
    { name: "Drupal", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/drupal/drupal-original.svg" },
    { name: "Strapi", icon: "https://strapi.io/assets/strapi-logo-dark.svg" },
  ],
  security: [
    { name: "Nmap", icon: "https://nmap.org/images/nmap-logo-256x256.png" },
    { name: "Wireshark", icon: "https://www.wireshark.org/assets/icons/wireshark-fin.png" },
    { name: "Kali Linux", icon: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Kali-dragon-icon.svg" },
  ],
}

const categoryMeta = {
  backend: { icon: Server, color: "from-blue-500 to-cyan-500" },
  frontend: { icon: Layout, color: "from-purple-500 to-pink-500" },
  database: { icon: Database, color: "from-green-500 to-emerald-500" },
  devops: { icon: Cloud, color: "from-orange-500 to-red-500" },
  ecommerce: { icon: ShoppingCart, color: "from-yellow-500 to-orange-500" },
  cms: { icon: Globe, color: "from-indigo-500 to-purple-500" },
  security: { icon: Shield, color: "from-red-500 to-pink-500" },
}

const iconSlugs = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "vuedotjs",
  "angular",
  "nodedotjs",
  "python",
  "postgresql",
  "mongodb",
  "mysql",
  "docker",
  "kubernetes",
  "jenkins",
  "wordpress",
  "drupal",
  "html5",
  "css3",
  "tailwindcss",
  "git",
  "github",
  "vercel",
  "nginx",
  "linux",
  "ubuntu",
  "figma",
]

export default function TechStack() {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-20%" })

  const [activeCategory, setActiveCategory] = useState("frontend")
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const { t } = useLanguage()
  const categoryInfo = Object.fromEntries(
    Object.entries(t.techStack.categories).map(([key, category]) => [
      key,
      { ...category, ...categoryMeta[key as keyof typeof categoryMeta] },
    ]),
  )

  const categories = Object.keys(categoryInfo)

  // Detectar si es un dispositivo táctil
  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
    }

    detectTouch()
    window.addEventListener("touchstart", () => setIsTouchDevice(true), { once: true })

    return () => {
      window.removeEventListener("touchstart", () => setIsTouchDevice(true))
    }
  }, [])

  const handleCategoryHover = useCallback(
    (category: string) => {
      if (!isTouchDevice && !isMobile) {
        setActiveCategory(category)
      }
    },
    [isTouchDevice, isMobile],
  )

  const handleCategoryClick = useCallback(
    (category: string, index: number) => {
      setActiveCategory(category)
      if (isMobile) {
        setCurrentSlide(index)
      }
    },
    [isMobile],
  )

  return (
    <section
      id="tech-stack"
      ref={ref}
      className="relative min-h-screen py-16 md:py-24 lg:py-32 bg-background text-foreground overflow-hidden"
    >
      <NetworkBackground color={theme === "dark" ? "#64ffda" : "#0891b2"} density={60} />

      <ResponsiveContainer maxWidth="2xl" paddingX="lg">
        <TechStackHeader isInView={isInView} />

        {/* Mobile Layout */}
        {isMobile && (
          <div className="space-y-8">
            <TechStackIconCloud isInView={isInView} isMobile={isMobile} isTablet={isTablet} iconSlugs={iconSlugs} />
            <TechStackCategoryNavigation
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isMobile={isMobile}
              isTablet={isTablet}
              categories={categories}
              categoryInfo={categoryInfo}
              currentSlide={currentSlide}
              setCurrentSlide={setCurrentSlide}
              handleCategoryClick={handleCategoryClick}
              handleCategoryHover={handleCategoryHover}
            />
            <TechStackCategoryDetails
              activeCategory={activeCategory}
              technologies={technologies}
              categoryInfo={categoryInfo}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </div>
        )}

        {/* Tablet Layout */}
        {isTablet && !isMobile && (
          <div className="space-y-12">
            <TechStackIconCloud isInView={isInView} isMobile={isMobile} isTablet={isTablet} iconSlugs={iconSlugs} />
            <TechStackCategoryNavigation
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isMobile={isMobile}
              isTablet={isTablet}
              categories={categories}
              categoryInfo={categoryInfo}
              currentSlide={currentSlide}
              setCurrentSlide={setCurrentSlide}
              handleCategoryClick={handleCategoryClick}
              handleCategoryHover={handleCategoryHover}
            />
            <TechStackCategoryDetails
              activeCategory={activeCategory}
              technologies={technologies}
              categoryInfo={categoryInfo}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </div>
        )}

        {/* Desktop Layout */}
        {!isTablet && !isMobile && (
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <TechStackIconCloud isInView={isInView} isMobile={isMobile} isTablet={isTablet} iconSlugs={iconSlugs} />
            <TechStackDesktopCategories
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              categories={categories}
              categoryInfo={categoryInfo}
              technologies={technologies}
              currentSlide={currentSlide}
              setCurrentSlide={setCurrentSlide}
              handleCategoryClick={handleCategoryClick}
              handleCategoryHover={handleCategoryHover}
              isInView={isInView}
            />
          </div>
        )}
      </ResponsiveContainer>
    </section>
  )
}
