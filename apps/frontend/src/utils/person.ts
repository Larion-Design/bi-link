import { PersonAPIInput } from '../types/person'

export const getPersonFullName = ({ firstName, lastName }: Partial<PersonAPIInput>) =>
  `${lastName ?? ''} ${firstName ?? ''}`
