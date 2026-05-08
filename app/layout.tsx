// app/layout.tsx
import "./globals.css"
import Header from "@/features/layout/Header"
import Footer from "@/features/layout/Footer"
import { ThemeProvider } from "./theme-provider"
import { LanguageProvider } from "@/features/i18n/LanguageProvider"
import type { Metadata } from "next"
import type React from "react"
import Script from "next/script"
import { defaultMetadata } from "@/lib/seo"

export const metadata: Metadata = defaultMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var savedTheme = window.localStorage.getItem('theme');
                  var theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light';
                  if (!savedTheme) window.localStorage.setItem('theme', 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (_) {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
        {/* Ahrefs Web Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          strategy="afterInteractive"
          data-key="Ug68fmUjqKthKzoB4QevpA"
        />
        {/* Schema global: Organization/ProfessionalService */}
        <Script id="org-schema" type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "CodeMark",
              url: "https://codemark.es",
              areaServed: "SV",
              address: { "@type": "PostalAddress", addressCountry: "SV", addressLocality: "San Miguel" },
              sameAs: ["https://www.facebook.com/people/CodeMark/100092354044797"]
            })
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/c.ico" type="image/x-icon" />
      </head>
      <body>
        <LanguageProvider>
          <ThemeProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
