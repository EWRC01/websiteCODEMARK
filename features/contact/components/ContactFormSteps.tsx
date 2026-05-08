"use client"
import { motion } from "framer-motion"
import type { FormStep } from "../types"
import { cn } from "@/lib/utils"

interface ContactFormStepsProps {
  currentStep: FormStep
  totalSteps: number
}

export function ContactFormSteps({ currentStep, totalSteps }: ContactFormStepsProps) {
  return (
    <div className="flex justify-center gap-8 mt-6 mb-8">
      {[...Array(totalSteps)].map((_, index) => {
        const step = (index + 1) as FormStep
        return (
          <motion.div
            key={step}
            className={cn(
              "relative w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
              step === currentStep
                ? "bg-primary text-primary-foreground border-primary shadow-lg"
                : step < currentStep
                  ? "bg-primary/20 text-primary border-primary"
                  : "bg-muted text-muted-foreground border border-border",
              step < totalSteps &&
                "after:content-[''] after:absolute after:w-8 after:h-0.5 after:bg-border after:left-full after:ml-2",
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {step}
          </motion.div>
        )
      })}
    </div>
  )
}
