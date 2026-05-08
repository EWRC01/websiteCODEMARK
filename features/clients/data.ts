import type { ClientItem } from "./types"

/**
 * Minimal client shape used by the grid (name + logo).
 */
type BasicClient = {
  name: string
  logo: string
  slug?: string
}

/**
 * Basic client list.
 */
const basicClients: BasicClient[] = [
  { name: "herrerasshipping", logo: "/images/clients/1.svg" },
  { name: "sumachomeremodeling", logo: "/images/clients/2.svg" },
  { name: "Zona Digital", logo: "/images/clients/6.png" },
  { name: "Mr.H Coffee", logo: "/images/clients/3.svg" },
  { name: "Tortisal",            logo: "/images/clients/4.svg" },
  { name: "Salvalex", logo: "/images/clients/5.svg" },
]

/**
 * Optional non-translatable client details keyed by slug.
 */
const detailsBySlug: Partial<Record<string, Omit<ClientItem, "name" | "logo">>> = {
  herrerasshipping: {
    cover: "/clients/herrera/cover.jpg",
    // photos: ["/clients/herrera/1.jpg", "/clients/herrera/2.jpg"],
    url: "https://herrerasshipping.com/",
    tags: ["Next.js", "Tailwind"],
    country: "USA",
    year: 2025,
  },

  sumachomeremodeling: {
    cover: "/clients/sumac/cover.jpg",
    // photos: ["/clients/sumac/1.jpg"],
    url: "https://sumachomeremodeling.com/",
    tags: ["Next.js", "Tailwind"],
    country: "USA",
    year: 2025,
  },

  "zona-digital": {
    cover: "/images/clients/zonadigital/1.png",
    photos: ["/images/clients/zonadigital/2.jpeg", "/images/clients/zonadigital/3.jpeg"],
    url: "https://zonadigitalsv.com/",
    tags: ["E-commerce", "Checkout"],
    country: "SV",
    year: 2025,
  },

  "mr-h-coffee": {
    cover: "/images/clients/3.svg",
    // photos: ["/images/clients/zonadigital/2.jpeg", "/images/clients/zonadigital/3.jpeg"],
    url: "https://mrhcoffee.shop/",
     tags: ["Next.js", "Tailwind"],
    country: "USA",
    year: 2025,
  },
  // tortisal: { ... },
  // salvalex: { ... },
}

/** Normalizes names into predictable slugs. */
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * Builds the final ClientItem[] by merging optional details.
 */
export const clientLogos: ClientItem[] = basicClients.map((b) => {
  const key = b.slug ?? slugify(b.name)
  const extra = detailsBySlug[key] ?? detailsBySlug[b.name] ?? {}
  return { ...b, ...extra }
})

/**
 * Optional helpers for slug-based routes.
 */
export function getClientBySlug(slug: string): ClientItem | undefined {
  const map = new Map(clientLogos.map((c) => [slugify(c.slug ?? c.name), c]))
  return map.get(slug)
}

export function listBasicClients(): BasicClient[] {
  return basicClients
}
