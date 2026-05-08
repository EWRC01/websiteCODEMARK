"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Briefcase, CheckCircle2, ChevronDown, Globe2, Phone, Search } from "lucide-react"
import { FormField } from "./FormField"
import type { ContactFormData, ContactFormStepProps } from "../types"
import { ResponsiveText } from "@/components/ui/responsive-text"
import { useLanguage } from "@/features/i18n/LanguageProvider"
import { countryCallingCodes } from "@/features/contact/countryCallingCodes"
import { cn } from "@/lib/utils"

function createFieldChange(name: keyof ContactFormData, value: string) {
  return {
    target: { name, value },
  } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
}

function getFlagEmoji(iso2: string) {
  if (iso2 === "AC") return "🇦🇨"
  if (iso2 === "TA") return "🇹🇦"
  if (iso2 === "XK") return "🇽🇰"

  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

function useCountryCodeOptions(language: "es" | "en") {
  return useMemo(() => {
    const displayNames = new Intl.DisplayNames([language], { type: "region" })

    return countryCallingCodes
      .map((country) => ({
        ...country,
        countryName: displayNames.of(country.iso2) ?? country.iso2,
        flag: getFlagEmoji(country.iso2),
      }))
      .sort((a, b) => a.countryName.localeCompare(b.countryName, language))
  }, [language])
}

export function ContactFormStep2({ formData, handleInputChange, formErrors }: ContactFormStepProps) {
  const { language, t } = useLanguage()
  const text = t.contact.steps.details
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const countryPickerRef = useRef<HTMLDivElement>(null)
  const countryCodeOptions = useCountryCodeOptions(language)
  const selectedCountry =
    countryCodeOptions.find((option) => option.iso2 === formData.countryIso2) ??
    countryCodeOptions.find((option) => option.dialCode === formData.countryCode)
  const filteredCountryOptions = useMemo(() => {
    const normalizedSearch = countrySearch.trim().toLowerCase()
    if (!normalizedSearch) return countryCodeOptions

    return countryCodeOptions.filter((option) => {
      const searchableText = `${option.countryName} ${option.iso2} ${option.dialCode}`.toLowerCase()
      return searchableText.includes(normalizedSearch)
    })
  }, [countryCodeOptions, countrySearch])

  useEffect(() => {
    if (!isCountryPickerOpen) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!countryPickerRef.current?.contains(event.target as Node)) {
        setIsCountryPickerOpen(false)
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [isCountryPickerOpen])

  const selectCountryCode = (dialCode: string, iso2: string) => {
    handleInputChange(createFieldChange("countryCode", dialCode))
    handleInputChange(createFieldChange("countryIso2", iso2))
    setCountrySearch("")
    setIsCountryPickerOpen(false)
  }

  return (
    <>
      <ResponsiveText as="h3" size="xl" weight="semibold" className="mb-6 text-primary text-center xs:text-left">
        {text.title}
      </ResponsiveText>

      <div className="space-y-5">
        <FormField
          name="company"
          placeholder={text.company}
          icon={Briefcase}
          value={formData.company}
          onChange={handleInputChange}
          required
          error={formErrors.company}
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground" htmlFor="countryCode">
            {text.countryCode}
          </label>
          <div className="grid gap-3 sm:grid-cols-[minmax(15rem,18rem)_1fr]">
            <div className="relative" ref={countryPickerRef}>
              <button
                type="button"
                id="countryCode"
                className={cn(
                  "flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border bg-background/80 px-4 py-3 text-left text-sm text-foreground shadow-sm outline-none transition hover:border-primary/60 hover:bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/20",
                  formErrors.countryCode ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border",
                )}
                onClick={() => setIsCountryPickerOpen((isOpen) => !isOpen)}
                aria-expanded={isCountryPickerOpen}
                aria-haspopup="listbox"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-lg" aria-hidden="true">
                    {selectedCountry?.flag ?? "🌐"}
                  </span>
                  <span className="min-w-0 truncate font-semibold">{selectedCountry?.dialCode ?? formData.countryCode}</span>
                  <span className="hidden min-w-0 truncate text-muted-foreground xs:inline">
                    {selectedCountry?.countryName ?? text.countrySearchPlaceholder}
                  </span>
                </span>
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 text-muted-foreground transition", isCountryPickerOpen && "rotate-180")}
                />
              </button>

              {isCountryPickerOpen ? (
                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
                  <div className="relative border-b border-border bg-background/95 p-3">
                    <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={countrySearch}
                      onChange={(event) => setCountrySearch(event.target.value)}
                      placeholder={text.countrySearchPlaceholder}
                      className="h-11 w-full rounded-xl border border-border bg-background py-2 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-72 overflow-y-auto p-2" role="listbox">
                    {filteredCountryOptions.length > 0 ? (
                      filteredCountryOptions.map((option) => {
                        const isSelected = option.iso2 === formData.countryIso2

                        return (
                          <button
                            key={`${option.iso2}-${option.dialCode}`}
                            type="button"
                            onClick={() => selectCountryCode(option.dialCode, option.iso2)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-primary/10 focus:bg-primary/10 focus:outline-none",
                              isSelected && "bg-primary/10 text-primary",
                            )}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <span className="text-lg" aria-hidden="true">
                              {option.flag}
                            </span>
                            <span className="min-w-0 flex-1 truncate font-medium">{option.countryName}</span>
                            <span className="font-bold text-foreground">{option.dialCode}</span>
                          </button>
                        )
                      })
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl px-3 py-4 text-sm text-muted-foreground">
                        <Globe2 className="h-4 w-4" />
                        {text.countrySearchEmpty}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder={text.phone}
                value={formData.phone}
                onChange={handleInputChange}
                className={cn(
                  "min-h-[52px] w-full rounded-xl border bg-background/70 py-3.5 pl-12 pr-4 text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
                  formErrors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border",
                )}
                required
              />
            </div>
          </div>
          {(formErrors.countryCode || formErrors.phone) && (
            <p className="mt-2 text-xs text-red-500">{formErrors.countryCode || formErrors.phone}</p>
          )}
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm font-semibold text-foreground">{text.service}</label>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{text.serviceHint}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {text.options.map((option, index) => {
              const isSelected = formData.service === option.value
              const isLastOddOption = text.options.length % 2 === 1 && index === text.options.length - 1

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange(createFieldChange("service", option.value))}
                  className={cn(
                    "group flex min-h-[72px] items-center justify-center gap-3 rounded-2xl border p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30 xs:justify-start xs:text-left",
                    isSelected ? "border-primary bg-primary/10 shadow-primary/10" : "border-border bg-background/70",
                    isLastOddOption && "sm:col-span-2",
                  )}
                  aria-pressed={isSelected}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-primary",
                    )}
                  >
                    {isSelected ? <CheckCircle2 className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                  </span>
                  <span className="font-semibold leading-snug text-foreground">{option.label}</span>
                </button>
              )
            })}
          </div>

          {formErrors.service ? <p className="mt-2 text-xs text-red-500">{formErrors.service}</p> : null}
        </div>
      </div>
    </>
  )
}
