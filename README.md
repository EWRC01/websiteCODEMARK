# CodeMark Website

## Estructura del Proyecto

El proyecto está organizado con **Screaming Architecture**: las carpetas principales comunican dominios del negocio y no solo tipos técnicos. Esta organización no cambia el diseño visual original; el diseño debe permanecer alineado con el baseline visual solicitado (`3a8b516e8c3e61a984cefc0f40563ebe720a8e38`) y solo se deben reubicar archivos para que el proyecto sea más fácil de navegar.

```text
codemark-website/
├── app/                      # Next.js App Router: rutas, layout y páginas
│   ├── layout.tsx
│   ├── page.tsx
│   └── clientes/
├── features/                 # Dominios y secciones del producto
│   ├── about/
│   ├── benefits/
│   ├── clients/              # Sección, cards, grid, data y tipos de clientes
│   ├── contact/              # Formulario, pasos, validación y tipos
│   ├── demo/
│   ├── home/
│   ├── layout/               # Header, Footer y navegación
│   ├── services/             # Servicios, cards, data y tipos
│   ├── team/
│   ├── tech-stack/
│   └── values/
├── shared/                   # Código compartido no asociado a un dominio
│   └── backgrounds/
├── components/ui/            # Primitivas UI reutilizables
├── hooks/                    # Custom hooks
├── lib/                      # Utilidades globales
├── public/                   # Archivos estáticos
├── styles/                   # Estilos globales
└── utils/                    # Utilidades auxiliares
```

## Instalación

Para configurar y ejecutar el proyecto localmente, sigue estos pasos:

1. **Clona el repositorio:**

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd codemark-website
   ```

2. **Instala las dependencias con pnpm:**

   ```bash
   pnpm install
   ```

3. **Ejecuta el servidor de desarrollo:**

   ```bash
   pnpm dev
   ```

   El sitio estará disponible en `http://localhost:3000`.

4. **Construye para producción:**

   ```bash
   pnpm build
   ```

## Guía de Organización

### Principios

1. **Screaming Architecture**: las rutas de archivos deben decir qué dominio o sección representan (`features/contact`, `features/services`, etc.).
2. **Preservar UI/UX**: mover archivos o ajustar imports no debe cambiar textos, layout, animaciones, estilos, fuentes, labels, validaciones ni comportamiento visual respecto al baseline `3a8b516e8c3e61a984cefc0f40563ebe720a8e38`.
3. **Cohesión**: subcomponentes, tipos, data y validaciones propias de una sección viven dentro de su feature.
4. **Reutilización**: primitivas visuales genéricas viven en `components/ui`; elementos compartidos sin dominio viven en `shared`.

### Estructura recomendada para una feature

```text
features/domain-name/
├── DomainSection.tsx     # Componente principal del dominio
├── components/           # Subcomponentes propios del dominio
├── data.ts               # Datos estáticos del dominio cuando aplica
├── types.ts              # Tipos específicos del dominio
└── validation.ts         # Reglas propias cuando aplica
```

### Ejemplo de importación

```tsx
import About from '@/features/about/About';
import Services from '@/features/services/Services';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/media';
```

## Convenciones de Nomenclatura

- **Componentes**: PascalCase (ej. `ServiceCard.tsx`).
- **Hooks**: camelCase con prefijo `use` (ej. `useMediaQuery.ts`).
- **Utilidades**: camelCase (ej. `validateEmail.ts`).
- **Carpetas**: kebab-case cuando el nombre tenga varias palabras (ej. `tech-stack`).
- **Datos y tipos de dominio**: `data.ts` y `types.ts` dentro de la feature correspondiente.
