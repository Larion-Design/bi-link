import { PersonAPIInput } from 'defs'

export const getPersonFullName = ({
  firstName: { value: firstNameValue },
  lastName: { value: lastNameValue },
}: Partial<PersonAPIInput>) => `${lastNameValue ?? ''} ${firstNameValue ?? ''}`.trim()

export const getPersonAge = ({ birthdate: { value } }: Partial<PersonAPIInput>) => {
  if (value) {
    return new Date().getFullYear() - new Date(value).getFullYear()
  }
}
