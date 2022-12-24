import { PersonAPIInput } from 'defs'

export const getPersonFullName = ({ firstName, lastName }: Partial<PersonAPIInput>) =>
  `${lastName ?? ''} ${firstName ?? ''}`
