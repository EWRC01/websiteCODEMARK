"use client"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { ServiceCard } from "./components/ServiceCard"
import { useLanguage } from "@/features/i18n/LanguageProvider"

import developImg from "@/images/develop.png"
import securityImg from "@/images/security.png"
import aiAutomationImg from "@/images/ai-automation.png"
import performanceImg from "@/images/performance.png"
import marketingImg from "@/images/marketing.png"
import consultingImg from "@/images/consulting.png"
import facturacionImg from "@/images/facturacion.png"

const serviceMeta = [
  {
    image: developImg,
    color: "from-blue-500 to-cyan-500",
    icon: "💻",
    category: "web",
    featured: true,
  },
  {
    image: securityImg,
    color: "from-purple-500 to-indigo-500",
    icon: "🔒",
    category: "security",
    featured: true,
  },
  {
    image: aiAutomationImg,
    color: "from-emerald-500 to-green-500",
    icon: "🤖",
    category: "automation",
    featured: false,
  },
  {
    image: performanceImg,
    color: "from-amber-500 to-orange-500",
    icon: "⚡",
    category: "performance",
    featured: false,
  },
  {
    image: marketingImg,
    color: "from-pink-500 to-rose-500",
    icon: "📈",
    category: "marketing",
    featured: false,
  },
  {
    image: consultingImg,
    color: "from-violet-500 to-purple-500",
    icon: "🔍",
    category: "consulting",
    featured: false,
  },
  {
    image: facturacionImg,
    color: "from-cyan-500 to-blue-500",
    icon: "🧾",
    category: "electronic-invoicing",
    featured: false,
  },
]

// ... resto sin cambios