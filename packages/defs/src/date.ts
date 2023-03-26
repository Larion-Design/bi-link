import { z } from 'zod'

export const dateSchema = z.union([z.date(), z.string()])
