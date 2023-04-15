import { create } from 'zustand'
import {
  CustomFieldAPI,
  FileAPIInput,
  IdDocumentAPI,
  OldName,
  PersonAPIInput,
  RelationshipAPI,
} from 'defs'
import { getDefaultTextWithMetadata } from 'tools'

type PersonState = {
  personInfo: Pick<PersonAPIInput, 'firstName' | 'lastName' | 'cnp'> & {
    documents: Map<string, IdDocumentAPI>
    files: Map<string, FileAPIInput>
    images: Map<string, FileAPIInput>
    oldNames: Map<string, OldName>
    relationships: Map<string, RelationshipAPI>
    customFields: Map<string, CustomFieldAPI>
    contactDetails: Map<string, CustomFieldAPI>
  }

  setPersonInfo: (personInfo: PersonAPIInput) => void
  setCustomFields: (customFields: CustomFieldAPI[]) => void
  setContactDetails: (customFields: CustomFieldAPI[]) => void
  setRelationships: (relationships: RelationshipAPI[]) => void
  setFiles: (files: FileAPIInput[]) => void
  setImages: (files: FileAPIInput[]) => void
  setDocuments: (documents: IdDocumentAPI[]) => void
}

export const personState = create<PersonState>((set) => ({
  personInfo: {
    firstName: getDefaultTextWithMetadata(),
    lastName: getDefaultTextWithMetadata(),
    cnp: getDefaultTextWithMetadata(),
    oldNames: new Map(),
    documents: new Map(),
    contactDetails: new Map(),
    relationships: new Map(),
    customFields: new Map(),
    files: new Map(),
    images: new Map(),
  },

  setPersonInfo: (personInfo) => {
    set({
      personInfo: {},
    })
  },

  setRelationships: (relationships) => {},
  setFiles: (files) => {},
  setImages: (files) => {},
  setCustomFields: (customFields) => {},
  setContactDetails: (customFields) => {},
  setDocuments: (documents) => {},
}))
