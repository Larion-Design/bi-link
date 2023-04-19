import { v4 } from 'uuid'
import { create } from 'zustand'
import {
  CustomFieldAPI,
  EducationAPIInput,
  IdDocumentAPI,
  LocationAPIInput,
  OldName,
  OptionalDateWithMetadata,
  PersonAPIInput,
  RelationshipAPI,
  TextWithMetadata,
} from 'defs'
import {
  getDefaultEducation,
  getDefaultIdDocument,
  getDefaultLocation,
  getDefaultOldName,
  getDefaultOptionalDateWithMetadata,
  getDefaultRelationship,
  getDefaultTextWithMetadata,
} from 'tools'
import { createContactDetailsStore, ContactDetailsState } from './contactDetailsState'
import { createCustomFieldsStore, CustomFieldsState } from './customFieldsState'
import { createFilesStore, FilesState } from './filesStore'
import { createImagesStore, ImagesState } from './imagesStore'
import { createMetadataStore, MetadataState } from './metadataStore'
import { removeMapItems } from './utils'

type PersonState = MetadataState &
  FilesState &
  ImagesState &
  CustomFieldsState &
  ContactDetailsState & {
    firstName: TextWithMetadata
    lastName: TextWithMetadata
    cnp: TextWithMetadata
    birthdate: OptionalDateWithMetadata
    birthPlace: LocationAPIInput
    homeAddress: LocationAPIInput
    documents: Map<string, IdDocumentAPI>
    oldNames: Map<string, OldName>
    relationships: Map<string, RelationshipAPI>
    education: Map<string, EducationAPIInput>

    setPersonInfo: (personInfo: PersonAPIInput) => void

    updateFirstName: (fieldInfo: TextWithMetadata) => void
    updateLastName: (fieldInfo: TextWithMetadata) => void
    updateCnp: (fieldInfo: TextWithMetadata) => void
    updateBirthdate: (fieldInfo: OptionalDateWithMetadata) => void
    updateBirthPlace: (fieldInfo: LocationAPIInput) => void
    updateHomeAddress: (fieldInfo: LocationAPIInput) => void
    updateRelationship: (relationshipInfo: RelationshipAPI) => void
    updateContactDetails: (uid: string, customField: CustomFieldAPI) => void
    updateOldName: (uid: string, oldName: OldName) => void
    updateDocument: (uid: string, documentInfo: IdDocumentAPI) => void
    updateEducation: (uid: string, education: EducationAPIInput) => void

    addRelationships: (personsIds: string[]) => void
    addContactDetails: (fieldName: string) => void
    addOldName: () => void
    addDocument: (documentType: string) => void
    addEducation: () => void

    removeRelationships: (ids: string[]) => void
    removeContactDetails: (ids: string[]) => void
    removeOldNames: (ids: string[]) => void
    removeDocuments: (ids: string[]) => void
    removeEducation: (ids: string[]) => void
  }

export const usePersonState = create<PersonState>((set, get, state) => ({
  ...createMetadataStore(set, get, state),
  ...createFilesStore(set, get, state),
  ...createImagesStore(set, get, state),
  ...createCustomFieldsStore(set, get, state),
  ...createContactDetailsStore(set, get, state),

  firstName: getDefaultTextWithMetadata(),
  lastName: getDefaultTextWithMetadata(),
  cnp: getDefaultTextWithMetadata(),
  birthdate: getDefaultOptionalDateWithMetadata(),
  birthPlace: getDefaultLocation(),
  homeAddress: getDefaultLocation(),
  oldNames: new Map(),
  documents: new Map(),
  relationships: new Map(),
  education: new Map(),

  setPersonInfo: (personInfo) => {
    const relationshipsMap = new Map<string, RelationshipAPI>()
    personInfo.relationships.forEach((relationshipInfo) =>
      relationshipsMap.set(relationshipInfo.person._id, relationshipInfo),
    )

    const oldNamesMap = new Map<string, OldName>()
    personInfo.oldNames.forEach((oldName) => oldNamesMap.set(v4(), oldName))

    const documentsMap = new Map<string, IdDocumentAPI>()
    personInfo.documents.forEach((documentInfo) => documentsMap.set(v4(), documentInfo))

    const educationMap = new Map<string, EducationAPIInput>()
    personInfo.education.forEach((educationInfo) => educationMap.set(v4(), educationInfo))

    set({
      firstName: personInfo.firstName,
      lastName: personInfo.lastName,
      cnp: personInfo.cnp,
      birthdate: personInfo.birthdate,
      birthPlace: personInfo.birthPlace,
      homeAddress: personInfo.homeAddress,
      relationships: relationshipsMap,
      oldNames: oldNamesMap,
      documents: documentsMap,
      education: educationMap,
    })

    get().updateMetadata(personInfo.metadata)
    get().setContactDetails(personInfo.contactDetails)
    get().setCustomFields(personInfo.customFields)
    get().setFiles(personInfo.files)
    get().setImages(personInfo.images)
  },

  updateFirstName: (firstName) => set({ firstName }),
  updateLastName: (lastName) => set({ lastName }),
  updateCnp: (cnp) => set({ cnp }),
  updateBirthdate: (birthdate) => set({ birthdate }),
  updateBirthPlace: (birthPlace) => set({ birthPlace }),
  updateHomeAddress: (homeAddress) => set({ homeAddress }),
  updateRelationship: (relationship) =>
    set({
      relationships: new Map(get().relationships).set(relationship.person._id, relationship),
    }),
  updateOldName: (uid, oldName) => set({ oldNames: new Map(get().oldNames).set(uid, oldName) }),
  updateDocument: (uid, document) =>
    set({ documents: new Map(get().documents).set(uid, document) }),
  updateEducation: (uid, education) =>
    set({ education: new Map(get().education).set(uid, education) }),

  addRelationships: (personsIds) => {
    const relationshipsMap = get().relationships
    personsIds.forEach((personId) =>
      relationshipsMap.set(personId, getDefaultRelationship(personId)),
    )
    set({ relationships: new Map(relationshipsMap) })
  },
  addOldName: () => set({ oldNames: new Map(get().oldNames).set(v4(), getDefaultOldName()) }),
  addDocument: () => set({ documents: new Map(get().documents).set(v4(), getDefaultIdDocument()) }),
  addEducation: () => set({ education: new Map(get().education).set(v4(), getDefaultEducation()) }),

  removeRelationships: (ids) => set({ relationships: removeMapItems(get().relationships, ids) }),
  removeDocuments: (ids) => set({ documents: removeMapItems(get().documents, ids) }),
  removeOldNames: (ids) => set({ oldNames: removeMapItems(get().oldNames, ids) }),
  removeEducation: (ids) => set({ education: removeMapItems(get().education, ids) }),
}))
