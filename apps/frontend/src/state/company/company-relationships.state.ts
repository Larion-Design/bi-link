import { StateCreator } from 'zustand'
import {
  AssociateAPI,
  BooleanWithMetadata,
  CompanyRelationship,
  CompanyRelationshipType,
  CustomFieldAPI,
  NumberWithMetadata,
  OptionalDateWithMetadata,
  TextWithMetadata,
} from 'defs'
import { getDefaultCustomField } from 'default-values'
import { removeMapItems } from '../utils'

export type CompanyAssociateInfoState = Omit<CompanyRelationship, 'customFields'> & {
  customFields: Set<string>
}

export type CompanyRelationshipsState = {
  relationships: Map<string, CompanyRelationship>
  setRelationships: (relationships: CompanyRelationship[]) => void
  addRelationships: (relationships: CompanyRelationship[]) => void
  removeRelationship: (uid: string) => void
  updateRelationshipType: (uid: string, type: CompanyRelationshipType) => void
  getRelationships: () => CompanyRelationship[]
}

export const createCompanyRelationshipsStore: StateCreator<
  CompanyRelationshipsState,
  [],
  [],
  CompanyRelationshipsState
> = (set, get) => ({
  relationships: new Map(),

  setRelationships: (relationships) => {
    const map = new Map<string, CompanyRelationship>()
    relationships.forEach((relationship) =>
      map.set(String(relationship.person?._id ?? relationship.company?._id), relationship),
    )
    set({ relationships: map })
  },

  addRelationships(relationships) {
    const map = get().relationships

    relationships.forEach((relationship) => {
      const _id = String(relationship.company?._id ?? relationship.person?._id)

      if (!map.has(_id)) {
        map.set(_id, relationship)
      }
    })

    set({ relationships: new Map(map) })
  },

  removeRelationship(uid: string) {
    set({ relationships: removeMapItems(get().relationships, [uid]) })
  },

  updateRelationshipType(uid, type) {
    const relationships = get().relationships
    const relationship = relationships.get(uid)
    set({ relationships: new Map(relationships).set(uid, { ...relationship, type }) })
  },

  getRelationships: () => Array.from(get().relationships.values()),
})
