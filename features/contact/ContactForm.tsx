"use client"

import Script from "next/script"
import { useEffect, useState } from "react"
import { AnimatePresence, motion, useAnimation } from "framer-motion"
import { CheckCircle2, Mail, MapPin, Phone, Sparkles } from "lucide-react"
import NetworkBackground from "@/shared/backgrounds/NetworkBackground"
import { useTheme } from "@/app/theme-provider"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import { ContactFormSteps } from "./components/ContactFormSteps"
import { ContactFormStep1 } from "./components/ContactFormStep1"
import { ContactFormStep2 } from "./components/ContactFormStep2"
import { ContactFormStep3 } from "./components/ContactFormStep3"
import { FormNavigation } from "./components/FormNavigation"
import { ContactInfoCard } from "./components/ContactInfoCard"
import type { ContactFormData, FormErrors, FormStep } from "./types"
import { getStepErrors } from "./validation"
import { getCallingCodeByRegion } from "./countryCallingCodes"
import { useLanguage } from "@/features/i18n/LanguageProvider"

const RECAPTCHA_ACTION = "contact_submit"
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const LOCAL_RECAPTCHA_BYPASS_TOKEN = "local-dev-recaptcha-bypass"
const LOCAL_RECAPTCHA_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"])

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  company: "",
  countryCode: "+503",
  countryIso2: "SV",
  phone: "",
  service: "",
  message: "",
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [currentStep, setCurrentStep] = useState<FormStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const controls = useAnimation()
  const { theme } = useTheme()
  const { language, t } = useLanguage()
  const text = t.contact

  useEffect(() => {
    const browserLanguage = window.navigator.language.toLowerCase()
    const region = browserLanguage.split("-")[1]?.toUpperCase()
    const detectedCountryCode = getCallingCodeByRegion(region)

    if (detectedCountryCode && region) {
      setFormData((prev) => ({
        ...prev,
        countryCode: prev.countryCode || detectedCountryCode,
        countryIso2: prev.countryIso2 || region,
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    setIsSubmitted(false)
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.form
      if (newErrors[name as keyof ContactFormData]) {
        delete newErrors[name as keyof ContactFormData]
      }
      return newErrors
    })
  }

  const getRecaptchaToken = async () => {
    const isLocalRecaptchaHost = LOCAL_RECAPTCHA_HOSTNAMES.has(window.location.hostname)

    if (!recaptchaSiteKey) {
      return isLocalRecaptchaHost ? LOCAL_RECAPTCHA_BYPASS_TOKEN : null
    }

    const grecaptcha = await new Promise<Window["grecaptcha"]>((resolve) => {
      if (window.grecaptcha) {
        resolve(window.grecaptcha)
        return
      }

      window.setTimeout(() => resolve(window.grecaptcha), 1200)
    })

    if (!grecaptcha) {
      return null
    }

    await new Promise<void>((resolve) => {
      grecaptcha.ready(resolve)
    })

    return grecaptcha.execute(recaptchaSiteKey, { action: RECAPTCHA_ACTION })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: FormErrors = {
      ...getStepErrors(1, formData, language),
      ...getStepErrors(2, formData, language),
      ...getStepErrors(3, formData, language),
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    const recaptchaToken = await getRecaptchaToken().catch(() => null)

    if (!recaptchaToken) {
      setIsSubmitting(false)
      setFormErrors({ form: text.recaptchaError })
      return
    }

    const selectedService = text.steps.details.options.find((option) => option.value === formData.service)

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
        language,
        serviceLabel: selectedService?.label ?? formData.service,
        recaptchaToken,
      }),
    }).catch(() => null)

    setIsSubmitting(false)

    if (!response?.ok) {
      const payload = await response?.json().catch(() => null)
      const errorCode = payload && typeof payload === "object" && "code" in payload ? payload.code : undefined
      const errorMessage =
        errorCode === "RECAPTCHA_FAILED"
          ? text.recaptchaError
          : errorCode === "MAILJET_ACCOUNT_BLOCKED"
            ? text.mailjetAccountBlocked
            : errorCode === "MAILJET_AUTH_ERROR"
              ? text.mailjetAuthError
              : response?.status === 503
                ? text.serverError
                : text.networkError

      setFormErrors({ form: errorMessage })
      return
    }

    setFormData(initialFormData)
    setCurrentStep(1)
    setFormErrors({})
    setIsSubmitted(true)
  }

  const nextStepHandler = () => {
    const errors = getStepErrors(currentStep, formData, language)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitted(false)
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.form
      if (currentStep === 1) {
        delete newErrors.name
        delete newErrors.email
      } else if (currentStep === 2) {
        delete newErrors.company
        delete newErrors.countryCode
        delete newErrors.phone
        delete newErrors.service
      }
      return newErrors
    })

    setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as FormStep) : prev))
  }

  const prevStepHandler = () => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as FormStep) : prev))
  }

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } })
  }, [controls])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-background text-foreground py-24 overflow-hidden"
      id="contact"
    >
      {recaptchaSiteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      ) : null}
      <NetworkBackground color={theme === "dark" ? "#f43f5e" : "#be123c"} density={40} />

      <ResponsiveContainer maxWidth="2xl" paddingX="lg">
        <motion.div
          className="flex flex-col lg:flex-row gap-8 w-full z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
        >
          <motion.div
            className="flex-1 bg-card/95 backdrop-blur-md rounded-3xl border border-border p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <ResponsiveText as="h2" size="4xl" weight="bold" className="mb-6 text-primary">
                {text.title}
              </ResponsiveText>
              <ContactFormSteps currentStep={currentStep} totalSteps={3} />
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ContactFormStep1
                      formData={formData}
                      handleInputChange={handleInputChange}
                      formErrors={formErrors}
                    />
                  </motion.div>
                )}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ContactFormStep2
                      formData={formData}
                      handleInputChange={handleInputChange}
                      formErrors={formErrors}
                    />
                  </motion.div>
                )}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ContactFormStep3
                      formData={formData}
                      handleInputChange={handleInputChange}
                      formErrors={formErrors}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {isSubmitted ? (
                <motion.div
                  className="mb-5 overflow-hidden rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 via-primary/10 to-background p-[1px] shadow-lg shadow-emerald-500/10"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  role="status"
                  aria-live="polite"
                >
                  <div className="relative rounded-3xl bg-card/95 px-5 py-5 text-center sm:px-6">
                    <div className="absolute right-5 top-5 text-primary/30">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <p className="text-xl font-extrabold text-foreground">{text.successTitle}</p>
                    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{text.successSubtitle}</p>
                    <div className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span>{text.successHighlight}</span>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {formErrors.form ? (
                <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                  {formErrors.form}
                </p>
              ) : null}

              <FormNavigation
                currentStep={currentStep}
                prevStep={prevStepHandler}
                nextStep={nextStepHandler}
                canProceed={Object.keys(getStepErrors(currentStep, formData, language)).length === 0}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
              />
            </form>
          </motion.div>

          <div className="flex-1 space-y-6">
            <ContactInfoCard icon={Mail} title="Email" content="info@codemarksv.com" delay={0.2} />
            <ContactInfoCard icon={Phone} title={text.phone} content="+503 7258 3802" delay={0.3} />
            <ContactInfoCard icon={MapPin} title={text.location} content={["El Salvador, San Miguel"]} delay={0.4} />
          </div>
        </motion.div>
      </ResponsiveContainer>
    </section>
  )
}
