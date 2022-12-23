import { companyRegistrationNumberRequest } from '../../../../graphql/companies/queries/companyRegistrationNumberExists'

export const validateRegistrationNumber = async (
  registrationNumber: string,
  companyId?: string,
) => {
  if (!registrationNumber.length) return

  let error = validateRegistrationNumberLength(registrationNumber)

  if (!error) {
    error = validateRegistrationNumberFormat(registrationNumber)
  }
  if (!error) {
    error = await validateUniqueRegistrationNumber(registrationNumber, companyId)
  }
  return error
}

export const validateRegistrationNumberLength = (
  registrationNumber: string,
) => {
  if (registrationNumber.length < 3) {
    return 'Numărul de inregistrare trebuie sa contina minim trei caractere.'
  }
}

export const validateRegistrationNumberFormat = (
  registrationNumber: string,
) => {
  const regex = new RegExp(/^[CFJ](\d)+\/(\d)+\/(\d){4}$/g)

  if (!regex.test(registrationNumber)) {
    return 'Numărul de inregistrare nu are formatul corect.'
  }
}

const validateUniqueRegistrationNumber = async (
  registrationNumber: string,
  companyId?: string,
) => {
  const { data, error } = await companyRegistrationNumberRequest(
    registrationNumber,
    companyId,
  )

  if (error) {
    return 'O eroare a intervenit in timpul comunicarii cu serverul.'
  }
  if (data.companyRegistrationNumberExists) {
    return 'Numărul de inregistrare este deja asociat unei alte companii.'
  }
}
