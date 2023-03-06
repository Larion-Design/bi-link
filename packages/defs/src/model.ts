import { Metadata } from './metadata'

export type Model<E> = {
  [k in keyof E]: {
    value: E[k]
    metadata: Metadata
  }
}
