import { z } from 'zod'

export interface SearchSuggestions<T> {
  total: number
  records: T[]
}

export const searchSuggestionsSchema = z.object({
  total: z.number().min(0),
  records: z.array(z.unknown()),
})
