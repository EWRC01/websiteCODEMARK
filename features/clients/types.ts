export type ClientItem = {
  name: string
  logo: string

  // Todo lo demás es opcional (se mostrará si está)
  description?: string
  cover?: string
  photos?: string[]
  url?: string
  tags?: string[]
  industry?: string
  country?: string
  year?: number
  services?: string[]
  slug?: string
}
