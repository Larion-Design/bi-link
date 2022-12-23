import * as yup from 'yup'

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Adresa de email este invalida.')
    .required('Nu ai completat campul de email.'),
  password: yup
    .string()
    .min(8, 'Parola trebuie sa aiba intre 8 si 30 de caractere.')
    .max(30, 'Parola trebuie sa aiba intre 8 si 30 de caractere.')
    .required('Nu ai completat campul pentru parola.'),
})
