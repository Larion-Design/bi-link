export interface Metadata {
  access?: string
  trustworthiness?: Trustworthiness
  confirmed?: boolean
}

export interface Trustworthiness {
  source: string
  level: 1 | 2 | 3 | 4 | 5
}
