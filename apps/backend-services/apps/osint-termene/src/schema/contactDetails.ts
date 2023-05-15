import { z } from 'zod'

export const contactDetailsSchema = z.record(z.enum(['Telefon', 'Web']), z.string())
