import * as yup from 'yup'

const singleFileValidationSchema = yup.object().shape({
  fileId: yup.string().required(),
  name: yup.string().optional(),
  description: yup.string().optional(),
  isHidden: yup.boolean(),
})

const filesValidationSchema = yup
  .array()
  .optional()
  .of(singleFileValidationSchema)

export const validateFilesFormat = async (files: Array<unknown>) => {
  const isValid = await filesValidationSchema.isValid(files)

  if (!isValid) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}

export const validateSingleFileFormat = async (file: unknown) => {
  const isValid = await singleFileValidationSchema.isValid(file)

  if (!isValid) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}
