import { AssociateAPI, associateAPISchema } from 'defs'
import { isDatesOrderValid } from '@frontend/utils/date'
import { getShareholdersTotalEquity } from './helpers'

export const validateAssociates = async (associates: AssociateAPI[]) => {
  let error = await validateAssociatesStructure(associates)

  if (!error) {
    error = validateShareholdersEquity(associates)
  }
  if (!error) {
    error = validateAssociatesDates(associates)
  }
  return error
}

export const validateAssociatesStructure = async (associates: AssociateAPI[]) => {
  const isValid = await associateAPISchema.array().parseAsync(associates)

  if (!isValid) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}

export const validateShareholdersEquity = (associates: AssociateAPI[]) => {
  const totalEquity = parseFloat(getShareholdersTotalEquity(associates))

  if (totalEquity > 100) {
    return 'Procentul total de actiuni detinute de actionari nu poate depasi 100%.'
  }
}

export const validateAssociatesDates = (associates: AssociateAPI[]) => {
  const isValid = associates.every(({ startDate, endDate }) =>
    startDate && endDate
      ? isDatesOrderValid(new Date(startDate.value), new Date(endDate.value))
      : true,
  )

  if (!isValid) {
    return 'Data la care asociatul si-a inceput activitatea nu poate fi mai recenta decat data la care si-a incheiat activitatea.'
  }
}
