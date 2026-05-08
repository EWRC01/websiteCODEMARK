"use client"
import { MessageSquare } from "lucide-react"
import { FormField } from "./FormField"
import type { ContactFormStepProps } from "../types"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { useLanguage } from "@/features/i18n/LanguageProvider"

// Eliminamos la prop setCaptchaValue ya que no se usará
export function ContactFormStep3({ formData, handleInputChange, formErrors }: ContactFormStepProps) {
  const { t } = useLanguage()
  const text = t.contact.steps.project

  return (
    <>
      <ResponsiveText as="h3" size="xl" weight="semibold" className="mb-6 text-primary">
        {text.title}
      </ResponsiveText>
      <FormField
        name="message"
        as="textarea"
        placeholder={text.message}
        icon={MessageSquare}
        value={formData.message}
        onChange={handleInputChange}
        required
        rows={6} // Increased rows for better message input
        error={formErrors.message} // Pasar el error
      />
      {/* Se ha eliminado el placeholder de reCAPTCHA y su lógica */}
    </>
  )
}
