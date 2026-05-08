export interface ServiceProps {
  title: string
  description: string
  image: string
  category: string
  featured: boolean
  // Nuevas propiedades añadidas para ServiceCard
  details: string[]
  icon: string
  color: string
}

export interface ServicesProps {
  className?: string
}
