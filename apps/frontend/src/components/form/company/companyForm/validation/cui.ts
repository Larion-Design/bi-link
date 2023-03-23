import { companyCUIRequest } from '@frontend/graphql/companies/queries/companyCUIExists'

export const validateCompanyCUI = async (cui: string, companyId?: string) => {
  if (!cui.length) return

  let error = validateCUIFormat(cui)

  if (!error) {
    error = await validateUniqueCUI(cui, companyId)
  }
  return error
}

export const validateCUIFormat = (cui: string) => {
  const regex = new RegExp(/^(?:[A-Za-z]{2})*\d{1,10}$/g)

  if (!regex.test(cui)) {
    return 'Codul de Identificare Fiscala nu are formatul corect.'
  }
}

const validateUniqueCUI = async (cui: string, companyId?: string) => {
  const { data, error } = await companyCUIRequest(cui, companyId)

  if (error) {
    return 'O eroare a intervenit in timpul comunicarii cu serverul.'
  }
  if (data.companyCUIExists) {
    return 'Codul de Identificare Fiscala este deja înregistrat pentru o alta companie.'
  }
}
