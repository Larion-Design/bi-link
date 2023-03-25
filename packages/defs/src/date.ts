import { z } from 'zod'

export const dateSchema = z.date().or(z.string())
