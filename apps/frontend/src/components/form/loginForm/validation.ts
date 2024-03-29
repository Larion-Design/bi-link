import { z } from 'zod'

export const loginValidationSchema = z.object({
  email: z
    .string()
    .email('Adresa de email este invalida.')
    .nonempty('Nu ai completat campul de email.'),
  password: z
    .string()
    .min(8, 'Parola trebuie sa aiba intre 8 si 30 de caractere.')
    .max(30, 'Parola trebuie sa aiba intre 8 si 30 de caractere.')
    .nonempty('Nu ai completat campul pentru parola.'),
})
