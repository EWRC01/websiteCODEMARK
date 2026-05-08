/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./registry/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Colores personalizados para el sitio con mejor contraste en tema claro
        tech: {
          bg: "#f0f4f8", // Fondo claro para el tema light
          accent: "#0891b2", // Turquesa más oscuro para mejor contraste en light
          accent2: "#0e7490", // Turquesa secundario más oscuro
          dark: "#0a0f1a", // Color oscuro para textos en tema claro
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-tech": "linear-gradient(to right, transparent, rgba(8, 145, 178, 0.5), transparent)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "float-slow": "float 3s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
          "50%": { transform: "scale(1.5)", opacity: 0 },
        },
      },
      spacing: {
        // Espaciado vertical aumentado para secciones
        "section-y": "10rem", // Aumentado de 8rem
        "section-y-mobile": "8rem", // Aumentado de 6rem
        "section-y-sm": "6rem", // Nuevo para secciones pequeñas en móvil
        // Espaciado horizontal aumentado
        "content-x": "3rem", // Nuevo para contenido
        "content-x-mobile": "1.5rem", // Nuevo para contenido en móvil
      },
      fontSize: {
        "title-xl": "clamp(2.25rem, 8vw, 4rem)", // Ajustado para móviles
        "title-lg": "clamp(1.875rem, 5vw, 3.5rem)", // Ajustado
        "title-md": "clamp(1.25rem, 3vw, 2.5rem)", // Ajustado
        "body-lg": "clamp(1rem, 1.5vw, 1.375rem)",
        "body-md": "clamp(0.9rem, 1.5vw, 1.125rem)",
        "body-sm": "clamp(0.875rem, 1.5vw, 1rem)",
      },
      maxWidth: {
        // Contenedores más amplios
        "8xl": "88rem", // Nuevo
        "9xl": "96rem", // Nuevo
      },
      padding: {
        // Padding específico para secciones
        section: "8rem 0", // Nuevo
        "section-sm": "6rem 0", // Nuevo
        "section-xs": "4rem 0", // Nuevo
      },
      margin: {
        // Márgenes específicos para elementos
        element: "3rem", // Nuevo
        "element-sm": "2rem", // Nuevo
        "element-xs": "1rem", // Nuevo
      },
      // Nuevos breakpoints para mejor control responsive
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
        navBreakpoint: "932px", // Nuevo breakpoint para la navegación
      },
    },
  },
  plugins: [require("tailwindcss-animate")],


  
}


