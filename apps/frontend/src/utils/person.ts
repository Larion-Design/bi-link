import { PersonAPIInput } from 'defs'

export const getPersonFullName = ({ firstName, lastName }: Partial<PersonAPIInput>) =>
  `${lastName ?? ''} ${firstName ?? ''}`.trim()

export const getPersonAge = ({ birthdate }: Partial<PersonAPIInput>) => {
  if (birthdate) {
    return new Date().getFullYear() - new Date(birthdate).getFullYear()
  }
}
