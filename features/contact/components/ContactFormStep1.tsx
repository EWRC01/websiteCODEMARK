"use client"
import { Mail, User } from "lucide-react"
import { FormField } from "./FormField"
import type { ContactFormStepProps } from "../types"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { useLanguage } from "@/features/i18n/LanguageProvider"

export function ContactFormStep1({ formData, handleInputChange, formErrors }: ContactFormStepProps) {
  const { t } = useLanguage()
  const text = t.contact.steps.personal

  return (
    <>
      <ResponsiveText as="h3" size="xl" weight="semibold" className="mb-6 text-primary">
        {text.title}
      </ResponsiveText>
      <FormField
        name="name"
        placeholder={text.name}
        icon={User}
        value={formData.name}
        onChange={handleInputChange}
        required
        error={formErrors.name} // Pasar el error
      />
      <FormField
        name="email"
        type="email"
        placeholder={text.email}
        icon={Mail}
        value={formData.email}
        onChange={handleInputChange}
        required
        error={formErrors.email} // Pasar el error
      />
    </>
  )
}
