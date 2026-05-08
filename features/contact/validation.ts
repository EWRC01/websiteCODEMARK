import type { Language } from "@/features/i18n/LanguageProvider";
import { getTranslations } from "@/features/i18n/translations";
import type { ContactFormData, FormErrors, FormStep } from "./types";

export const validateField = (
  name: keyof ContactFormData,
  value: string,
  language: Language = "es",
): string | undefined => {
  const text = getTranslations(language).contact.validation;
  let error: string | undefined;
  switch (name) {
    case "name":
      if (!value.trim()) error = text.nameRequired;
      break;
    case "email":
      if (!value.trim()) {
        error = text.emailRequired;
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = text.emailInvalid;
      }
      break;
    case "company":
      if (!value.trim()) error = text.companyRequired;
      break;
    case "countryCode":
      if (!value.trim()) error = text.countryCodeRequired;
      break;
    case "phone": {
      const trimmedValue = value.trim();
      const digitsOnly = trimmedValue.replace(/\D/g, "");
      const hasValidCharacters = /^[0-9\s().-]+$/.test(trimmedValue);

      if (!trimmedValue) {
        error = text.phoneRequired;
      } else if (
        !hasValidCharacters ||
        digitsOnly.length < 6 ||
        digitsOnly.length > 15
      ) {
        error = text.phoneInvalid;
      }
      break;
    }
    case "service":
      if (!value) error = text.serviceRequired;
      break;
    case "message":
      if (!value.trim()) {
        error = text.messageRequired;
      } else if (value.trim().length < 10) {
        error = text.messageLength;
      }
      break;
  }
  return error;
};

export const getStepErrors = (
  step: FormStep,
  currentFormData: ContactFormData,
  language: Language = "es",
): FormErrors => {
  const newErrors: FormErrors = {};

  if (step === 1) {
    const fields = ["name", "email"] as const;
    fields.forEach((field) => {
      const error = validateField(field, currentFormData[field], language);
      if (error) newErrors[field] = error;
    });
  } else if (step === 2) {
    const fields = ["company", "countryCode", "phone", "service"] as const;
    fields.forEach((field) => {
      const error = validateField(field, currentFormData[field], language);
      if (error) newErrors[field] = error;
    });
  } else if (step === 3) {
    const fields = ["message"] as const;
    fields.forEach((field) => {
      const error = validateField(field, currentFormData[field], language);
      if (error) newErrors[field] = error;
    });
  }
  return newErrors;
};
