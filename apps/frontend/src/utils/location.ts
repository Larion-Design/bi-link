import { LocationAPIInput } from 'defs'

export const getLocationAddress = ({ street, number, locality }: LocationAPIInput) =>
  `${street} ${number}, ${locality}`.trim()
