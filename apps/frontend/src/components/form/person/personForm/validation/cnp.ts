import { personCNPRequest } from '@frontend/graphql/persons/queries/personCNPExists'

export const validateCNP = async (cnp: string, personId?: string) => {
  if (cnp.length) {
    let error = validateCNPFormat(cnp)

    if (!error) {
      error = await validateExistingCNP(cnp, personId)
    }
    return error
  }
}

export const validateCNPFormat = (cnp: string) => {
  const regex = new RegExp(
    /^[1-9](\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)(00[1-9]|0[1-9]\d|[1-9]\d\d)\d$/,
  )

  if (!regex.test(cnp)) {
    return 'Numărul CNP este invalid.'
  }
}

const validateExistingCNP = async (cnp: string, personId?: string) => {
  const { data, error } = await personCNPRequest(cnp, personId)

  if (error) {
    return 'O eroare a intervenit in timpul comunicarii cu serverul.'
  }
  if (data.personCNPExists) {
    return 'Numărul CNP este deja înregistrat pentru o alta persoana.'
  }
}
