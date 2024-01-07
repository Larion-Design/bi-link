import { associateAPISchema } from 'defs'
import { isDatesOrderValid } from '@frontend/utils/date'
import { CompanyAssociateInfoState } from 'state/company/companyAssociatesState'
import { getShareholdersTotalEquity } from './helpers'

export const validateAssociates = async (associates: Map<string, CompanyAssociateInfoState>) => {
  let error = await validateAssociatesStructure(associates)

  if (!error) {
    error = validateShareholdersEquity(associates)
  }
  if (!error) {
    error = validateAssociatesDates(associates)
  }
  return error
}

export const validateAssociatesStructure = async (
  associates: Map<string, CompanyAssociateInfoState>,
) => {
  const isValid = associateAPISchema.array().parse(associates)

  if (!isValid) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}

export const validateShareholdersEquity = (associates: Map<string, CompanyAssociateInfoState>) => {
  const totalEquity = parseFloat(getShareholdersTotalEquity(associates))

  if (totalEquity > 100) {
    return 'Procentul total de actiuni detinute de actionari nu poate depasi 100%.'
  }
}

export const validateAssociatesDates = (associates: Map<string, CompanyAssociateInfoState>) => {
  const isValid = Array.from(associates.values()).every(({ startDate, endDate }) =>
    startDate && endDate
      ? isDatesOrderValid(new Date(startDate.value), new Date(endDate.value))
      : true,
  )

  if (!isValid) {
    return 'Data la care asociatul si-a inceput activitatea nu poate fi mai recenta decat data la care si-a incheiat activitatea.'
  }
}
