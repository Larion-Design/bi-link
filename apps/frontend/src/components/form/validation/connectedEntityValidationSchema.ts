import * as yup from 'yup'

export const connectedEntityValidationSchema = yup.object({
  _id: yup.string().required(),
})
