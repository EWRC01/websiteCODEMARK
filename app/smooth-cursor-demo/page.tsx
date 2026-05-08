"use client"

import { SmoothCursor } from "@/registry/magicui/smooth-cursor"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import { useLanguage } from "@/features/i18n/LanguageProvider"

export default function SmoothCursorDemo() {
  const { t } = useLanguage()
  const text = t.demo.smoothCursor

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden p-8">
      <ResponsiveContainer maxWidth="md" className="text-center z-10">
        <ResponsiveText as="h1" size="4xl" weight="bold" className="mb-4">
          {text.title}
        </ResponsiveText>
        <ResponsiveText as="p" size="lg" color="muted" className="mb-8">
          <span className="hidden md:block">{text.desktopHint}</span>
          <span className="block md:hidden">{text.mobileHint}</span>
        </ResponsiveText>
      </ResponsiveContainer>
      <SmoothCursor />
    </div>
  )
}
