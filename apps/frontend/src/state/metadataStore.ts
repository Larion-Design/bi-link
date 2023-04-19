import { Metadata } from 'defs'
import { getDefaultMetadata } from 'tools'
import { StateCreator } from 'zustand'

export type MetadataState = {
  metadata: Metadata
  updateMetadata: (metadata: Metadata) => void
}

export const createMetadataStore: StateCreator<MetadataState, [], [], MetadataState> = (
  set,
  get,
  store,
) => ({
  metadata: getDefaultMetadata(),
  updateMetadata: (metadata) => set({ metadata }),
})
