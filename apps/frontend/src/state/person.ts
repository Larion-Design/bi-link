import { create } from 'zustand'
import { PersonAPIInput } from 'defs'
import { addItemToMap, removeMapItem, EntityState, updateMapItem, createMap } from './entityState'

type PersonSimpleFields = Pick<
  PersonAPIInput,
  'firstName' | 'lastName' | 'birthdate' | 'cnp' | 'homeAddress' | 'birthPlace'
>

type PersonListFields = Omit<
  PersonAPIInput,
  'firstName' | 'lastName' | 'birthdate' | 'cnp' | 'homeAddress' | 'birthPlace'
>

type PersonState = EntityState<PersonAPIInput, PersonSimpleFields, PersonListFields>

export const usePersonStore = create<PersonState>((set) => ({
  setEntity: (personInfo) => {
    if (!personInfo) {
      set({
        firstName: '',
        lastName: '',
        cnp: '',
        birthdate: null,
        homeAddress: null,
        birthPlace: null,
        relationships: new Map(),
        files: new Map(),
        images: new Map(),
        oldNames: new Map(),
        documents: new Map(),
        education: new Map(),
        contactDetails: new Map(),
        customFields: new Map(),
      })
    } else {
      set({
        firstName: personInfo.firstName,
        lastName: personInfo.lastName,
        cnp: '',
        birthdate: null,
        homeAddress: null,
        birthPlace: null,
        relationships: createMap(personInfo.relationships, ({ person: { _id } }) => _id),
        files: createMap(personInfo.files, ({ fileId }) => fileId),
        images: createMap(personInfo.images, ({ fileId }) => fileId),
        oldNames: createMap(personInfo.oldNames),
        documents: createMap(personInfo.documents),
        education: createMap(personInfo.education),
        contactDetails: createMap(personInfo.contactDetails),
        customFields: createMap(personInfo.customFields),
      })
    }
  },

  firstName: '',
  lastName: '',
  cnp: '',
  birthdate: null,
  homeAddress: null,
  birthPlace: null,
  relationships: new Map(),
  files: new Map(),
  images: new Map(),
  oldNames: new Map(),
  documents: new Map(),
  education: new Map(),
  contactDetails: new Map(),
  customFields: new Map(),

  setFirstName: () => null,
  setLastName: () => null,
  setCnp: () => null,
  setBirthPlace: () => null,
  setBirthdate: () => null,
  setHomeAddress: () => null,
  setCustomFields: () => null,
  setContactDetails: (itemId, value) =>
    set((state) => ({ contactDetails: updateMapItem(state.contactDetails, itemId, value) })),
  setFiles: () => null,
  setImages: () => null,
  setEducation: () => null,
  setDocuments: () => null,
  setRelationships: () => null,
  setOldNames: () => null,

  removeRelationships: () => null,
  removeDocuments: () => null,
  removeEducation: () => null,
  removeFiles: () => null,
  removeCustomFields: () => null,
  removeOldNames: () => null,
  removeImages: () => null,
  removeContactDetails: (id) =>
    set((state) => ({ contactDetails: removeMapItem(state.contactDetails, id) })),

  addRelationships: (relationshipInfo) =>
    set((state) => ({ relationships: addItemToMap(state.relationships, relationshipInfo) })),

  addImages: () => null,
  addFiles: () => null,
  addEducation: () => null,
  addContactDetails: () => null,
  addOldNames: () => null,
  addCustomFields: () => null,
  addDocuments: () => null,
}))
