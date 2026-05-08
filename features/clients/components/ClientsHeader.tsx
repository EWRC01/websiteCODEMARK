import React from "react"

export function ClientsHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="text-center">
      <h1
        className="
          font-extrabold tracking-tight text-balance
          text-[clamp(1.8rem,4.5vw,3.5rem)]
          leading-[1.12]
        "
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className="
            mt-3 mx-auto max-w-3xl text-muted-foreground
            text-[clamp(0.95rem,2.1vw,1.125rem)]
            leading-relaxed supports-[text-wrap:balance]:text-balance
          "
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  )
}
