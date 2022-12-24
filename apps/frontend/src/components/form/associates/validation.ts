import * as yup from 'yup'
import { AssociateAPIInput } from 'defs'
import { isDatesOrderValid } from '../../../utils/date'
import { connectedEntityValidationSchema } from '../validation/connectedEntityValidationSchema'
import { getShareholdersTotalEquity } from './helpers'

const associatesDataStructure = yup.array().of(
  yup.object({
    person: connectedEntityValidationSchema.optional(),
    company: connectedEntityValidationSchema.optional(),
    isActive: yup.boolean().required(),
    startDate: yup.date().optional().nullable(),
    endDate: yup.date().optional().nullable(),
    equity: yup.number(),
    customFields: yup.array(
      yup.object({
        fieldName: yup.string().required(),
        fieldValue: yup.string().required(),
      }),
    ),
  }),
)

export const validateAssociates = async (associates: AssociateAPIInput[]) => {
  let error = await validateAssociatesStructure(associates)

  if (!error) {
    error = validateShareholdersEquity(associates)
  }
  if (!error) {
    error = validateAssociatesDates(associates)
  }
  return error
}

export const validateAssociatesStructure = async (associates: AssociateAPIInput[]) => {
  const isValid = await associatesDataStructure.isValid(associates)

  if (!isValid) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}

export const validateShareholdersEquity = (associates: AssociateAPIInput[]) => {
  const totalEquity = parseFloat(getShareholdersTotalEquity(associates))

  if (totalEquity > 100) {
    return 'Procentul total de actiuni detinute de actionari nu poate depasi 100%.'
  }
}

export const validateAssociatesDates = (associates: AssociateAPIInput[]) => {
  const isValid = associates.every(({ startDate, endDate }) =>
    startDate && endDate ? isDatesOrderValid(new Date(startDate), new Date(endDate)) : true,
  )

  if (!isValid) {
    return 'Data la care asociatul si-a inceput activitatea nu poate fi mai recenta decat data la care si-a incheiat activitatea.'
  }
}
