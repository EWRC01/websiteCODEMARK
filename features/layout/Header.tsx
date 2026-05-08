"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "@/app/theme-provider"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { useIsSmallScreen } from "@/hooks/useBreakpoint"
import { navLinks } from "@/features/layout/navLinks"
import { useLanguage } from "@/features/i18n/LanguageProvider"
import { socialLinks } from "./socialLinks"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const isSmallScreen = useIsSmallScreen() // true when viewport width is <= 931px

  useEffect(() => {
    if (!isSmallScreen) setIsOpen(false)
  }, [isSmallScreen])

  const menuVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const languageSelector = (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1" aria-label="Language selector">
      {(["es", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-300 ${
            language === option ? "bg-primary text-primary-foreground" : "text-foreground hover:text-primary"
          }`}
          aria-pressed={language === option}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
      <ResponsiveContainer maxWidth="2xl" paddingX="lg" className="py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <ResponsiveText as="span" size="xl" weight="bold" className="text-primary">
              CodeMark
            </ResponsiveText>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden navBreakpoint:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                className="text-sm font-medium text-foreground transition-colors duration-300 hover:text-primary xl:text-base"
              >
                {t.nav.links[link.labelKey as keyof typeof t.nav.links]}
              </Link>
            ))}
            {languageSelector}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-foreground hover:text-primary transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile Menu Button + Theme */}
          <div className="flex items-center gap-2 navBreakpoint:hidden">
            {languageSelector}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-foreground hover:text-primary transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="p-2 rounded-md text-foreground hover:text-primary transition-colors duration-300"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && isSmallScreen && (
          <motion.nav
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={menuVariants}
            className="navBreakpoint:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md shadow-lg py-6 border-b border-x border-border rounded-b-lg"
          >
            <motion.ul className="flex flex-col items-center gap-2 px-4" variants={menuVariants}>
              {navLinks.map((link) => (
                <motion.li key={link.href} variants={itemVariants} className="w-full text-center">
                  <Link
                    href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-300 font-medium text-lg py-3 px-4"
                  >
                    {t.nav.links[link.labelKey as keyof typeof t.nav.links]}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={itemVariants}
              className="mt-5 flex flex-wrap justify-center gap-3 border-t border-border/60 px-6 pt-5"
            >
              {socialLinks.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
