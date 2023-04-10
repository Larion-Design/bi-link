import { Metadata } from 'defs'

export const getDefaultMetadata = (): Metadata => ({
  access: '',
  confirmed: false,
  trustworthiness: {
    level: 0,
    source: '',
  },
})
