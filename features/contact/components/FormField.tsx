"use client"
import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { FormFieldProps } from "../types"

export function FormField({
  label,
  name,
  icon: Icon,
  placeholder,
  type = "text",
  as = "input",
  options,
  value,
  onChange,
  rows = 4,
  className,
  error, // Nueva prop
  ...props
}: FormFieldProps) {
  const inputClasses = cn(
    "w-full py-3.5 pl-12 pr-4 bg-background/50 border rounded-lg text-foreground transition-all duration-300 focus:outline-none focus:ring-1",
    error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-border focus:border-primary focus:ring-primary/20", // Estilo condicional para error
    className,
  )

  const inputElement =
    as === "textarea" ? (
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={props.required} // Asegurar que required se pase
        rows={rows}
        className={inputClasses}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    ) : as === "select" ? (
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={props.required} // Asegurar que required se pase
        className={cn(inputClasses, "appearance-none")}
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={props.required} // Asegurar que required se pase
        className={inputClasses}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    )

  return (
    <motion.div
      className="relative mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
      {inputElement}
      {error && (
        <motion.p
          className="text-red-500 text-xs mt-1 ml-12"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}
