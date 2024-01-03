import {
  BooleanWithMetadata,
  NumberWithMetadata,
  OptionalDateWithMetadata,
  TextWithMetadata,
} from 'defs'
import { getDefaultMetadata } from './metadata'

export const getDefaultTextWithMetadata = (): TextWithMetadata => ({
  metadata: getDefaultMetadata(),
  value: '',
})

export const getDefaultOptionalDateWithMetadata = (): OptionalDateWithMetadata => ({
  metadata: getDefaultMetadata(),
  value: null,
})

export const getDefaultNumberWithMetadata = (): NumberWithMetadata => ({
  metadata: getDefaultMetadata(),
  value: 0,
})

export const getDefaultBooleanWithMetadata = (): BooleanWithMetadata => ({
  metadata: getDefaultMetadata(),
  value: false,
})
