"use client"
import { motion } from "framer-motion"
import type { ContactInfoCardProps } from "../types"
import { ResponsiveText } from "@/components/ui/responsive-text"

export function ContactInfoCard({ icon: Icon, title, content, delay }: ContactInfoCardProps) {
  return (
    <motion.div
      className="bg-card/95 backdrop-blur-md rounded-2xl border border-border p-6 shadow-lg flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <ResponsiveText as="h4" size="base" weight="semibold">
          {title}
        </ResponsiveText>
        {Array.isArray(content) ? (
          content.map((line, i) => (
            <p key={i} className="text-muted-foreground text-sm">
              {line}
            </p>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">{content}</p>
        )}
      </div>
    </motion.div>
  )
}
