"use client"

import { Send } from "lucide-react"
import type { FormNavigationProps } from "../types"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/features/i18n/LanguageProvider"

export function FormNavigation({
  currentStep,
  prevStep,
  nextStep,
  canProceed,
  isSubmitting,
  handleSubmit,
}: FormNavigationProps) {
  const { t } = useLanguage()
  const text = t.contact.navigation

  return (
    <div className="w-full mt-12 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
      {/* Botón Anterior */}
      {currentStep > 1 && (
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
          className="w-full sm:w-auto px-6 py-3 rounded-full 
                     border border-cyan-600 
                     text-cyan-700 dark:text-cyan-300 
                     bg-white dark:bg-transparent 
                     hover:bg-cyan-100 dark:hover:bg-cyan-600/10 
                     hover:text-cyan-900 dark:hover:text-white 
                     transition-colors font-semibold"
        >
          {text.previous}
        </Button>
      )}

      {/* Botón Siguiente o {text.send} */}
      {currentStep < 3 ? (
        <Button
          type="button"
          onClick={nextStep}
          disabled={!canProceed}
          className="w-full sm:w-auto px-6 py-3 rounded-full 
                     bg-cyan-600 hover:bg-cyan-700 
                     text-white font-semibold transition-all 
                     dark:bg-cyan-500 dark:hover:bg-cyan-600"
        >
          {text.next}
        </Button>
      ) : (
        <Button
          type="submit"
          // ✅ Asegúrate de NO pasarla a `onClick`, ya que el botón ya es de tipo submit
          disabled={isSubmitting || !canProceed}
          className="w-full sm:w-auto px-6 py-3 rounded-full 
                     bg-gradient-to-r from-cyan-600 to-blue-600 
                     hover:from-cyan-700 hover:to-blue-700 
                     text-white font-semibold 
                     flex items-center justify-center gap-2 
                     shadow-lg transition-all 
                     dark:from-cyan-500 dark:to-blue-500 
                     dark:hover:from-cyan-600 dark:hover:to-blue-600"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{text.sending}</span>
            </>
          ) : (
            <>
              <span>{text.send}</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </Button>
      )}
    </div>
  )
}
