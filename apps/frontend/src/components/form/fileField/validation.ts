import { fileInputSchema } from 'defs'

export const validateFilesFormat = async (files: Array<unknown>) => {
  const isValid = await fileInputSchema.array().parseAsync(files)

  if (!isValid) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}

export const validateSingleFileFormat = async (file: unknown) => {
  const isValid = await fileInputSchema.parseAsync(file)

  if (!isValid) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}
