"use client"

import { motion } from "framer-motion"
import type { ClientItem } from "../types"
import { ClientCard } from "./ClientCard"

export function ClientsGrid({ items }: { items: ClientItem[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
      role="list"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {items.map((client, idx) => (
        <motion.div
          key={`${client.name}-${idx}`}
          variants={{
            hidden: { opacity: 0, y: 24 },
            show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
          }}
          role="listitem"
        >
          <ClientCard client={client} />
        </motion.div>
      ))}
    </motion.div>
  )
}
