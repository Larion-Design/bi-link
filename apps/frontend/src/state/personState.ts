import { v4 } from 'uuid'
import { create } from 'zustand'
import {
  CustomFieldAPI,
  EducationAPIInput,
  FileAPIInput,
  IdDocumentAPI,
  LocationAPIInput,
  Metadata,
  OldName,
  OptionalDateWithMetadata,
  PersonAPIInput,
  RelationshipAPI,
  TextWithMetadata,
} from 'defs'
import {
  getDefaultCustomField,
  getDefaultEducation,
  getDefaultIdDocument,
  getDefaultLocation,
  getDefaultMetadata,
  getDefaultOldName,
  getDefaultOptionalDateWithMetadata,
  getDefaultRelationship,
  getDefaultTextWithMetadata,
} from 'tools'
import { removeMapItems } from './utils'

type PersonState = {
  metadata: Metadata
  firstName: TextWithMetadata
  lastName: TextWithMetadata
  cnp: TextWithMetadata
  birthdate: OptionalDateWithMetadata
  birthPlace: LocationAPIInput
  homeAddress: LocationAPIInput
  documents: Map<string, IdDocumentAPI>
  files: Map<string, FileAPIInput>
  images: Map<string, FileAPIInput>
  oldNames: Map<string, OldName>
  relationships: Map<string, RelationshipAPI>
  customFields: Map<string, CustomFieldAPI>
  contactDetails: Map<string, CustomFieldAPI>
  education: Map<string, EducationAPIInput>

  setPersonInfo: (personInfo: PersonAPIInput) => void
  setImages: (images: FileAPIInput[]) => void
  setFiles: (images: FileAPIInput[]) => void

  updateFirstName: (fieldInfo: TextWithMetadata) => void
  updateLastName: (fieldInfo: TextWithMetadata) => void
  updateCnp: (fieldInfo: TextWithMetadata) => void
  updateBirthdate: (fieldInfo: OptionalDateWithMetadata) => void
  updateBirthPlace: (fieldInfo: LocationAPIInput) => void
  updateHomeAddress: (fieldInfo: LocationAPIInput) => void
  updateRelationship: (relationshipInfo: RelationshipAPI) => void
  updateCustomField: (uid: string, customField: CustomFieldAPI) => void
  updateContactDetails: (uid: string, customField: CustomFieldAPI) => void
  updateOldName: (uid: string, oldName: OldName) => void
  updateDocument: (uid: string, documentInfo: IdDocumentAPI) => void
  updateFile: (fileInfo: FileAPIInput) => void
  updateImage: (fileInfo: FileAPIInput) => void
  updateEducation: (uid: string, education: EducationAPIInput) => void

  addRelationships: (personsIds: string[]) => void
  addCustomField: (fieldName: string) => void
  addContactDetails: (fieldName: string) => void
  addOldName: () => void
  addDocument: (documentType: string) => void
  addFile: (fileInfo: FileAPIInput) => void
  addImage: (fileInfo: FileAPIInput) => void
  addEducation: () => void

  removeRelationships: (ids: string[]) => void
  removeCustomFields: (ids: string[]) => void
  removeContactDetails: (ids: string[]) => void
  removeOldNames: (ids: string[]) => void
  removeDocuments: (ids: string[]) => void
  removeFiles: (ids: string[]) => void
  removeImages: (ids: string[]) => void
  removeEducation: (ids: string[]) => void
}

export const usePersonState = create<PersonState>((set, getState) => ({
  metadata: getDefaultMetadata(),
  firstName: getDefaultTextWithMetadata(),
  lastName: getDefaultTextWithMetadata(),
  cnp: getDefaultTextWithMetadata(),
  birthdate: getDefaultOptionalDateWithMetadata(),
  birthPlace: getDefaultLocation(),
  homeAddress: getDefaultLocation(),
  oldNames: new Map(),
  documents: new Map(),
  contactDetails: new Map(),
  relationships: new Map(),
  customFields: new Map(),
  files: new Map(),
  images: new Map(),
  education: new Map(),

  setPersonInfo: (personInfo) => {
    const relationshipsMap = new Map<string, RelationshipAPI>()
    personInfo.relationships.forEach((relationshipInfo) =>
      relationshipsMap.set(relationshipInfo.person._id, relationshipInfo),
    )

    const oldNamesMap = new Map<string, OldName>()
    personInfo.oldNames.forEach((oldName) => oldNamesMap.set(v4(), oldName))

    const filesMap = new Map<string, FileAPIInput>()
    personInfo.files.forEach((fileInfo) => filesMap.set(fileInfo.fileId, fileInfo))

    const imagesMap = new Map<string, FileAPIInput>()
    personInfo.images.forEach((fileInfo) => imagesMap.set(fileInfo.fileId, fileInfo))

    const customFieldsMap = new Map<string, CustomFieldAPI>()
    personInfo.customFields.forEach((customField) => customFieldsMap.set(v4(), customField))

    const contactDetailsMap = new Map<string, CustomFieldAPI>()
    personInfo.contactDetails.forEach((customField) => contactDetailsMap.set(v4(), customField))

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
      files: filesMap,
      images: imagesMap,
      customFields: customFieldsMap,
      contactDetails: contactDetailsMap,
      documents: documentsMap,
      education: educationMap,
    })
  },
  setFiles: (files) => {
    const filesMap = new Map<string, FileAPIInput>()
    files.forEach((fileInfo) => filesMap.set(fileInfo.fileId, fileInfo))
    set({ files: filesMap })
  },
  setImages: (images) => {
    const imagesMap = new Map<string, FileAPIInput>()
    images.forEach((fileInfo) => imagesMap.set(fileInfo.fileId, fileInfo))
  },

  updateFirstName: (firstName) => set({ firstName }),
  updateLastName: (lastName) => set({ lastName }),
  updateCnp: (cnp) => set({ cnp }),
  updateBirthdate: (birthdate) => set({ birthdate }),
  updateBirthPlace: (birthPlace) => set({ birthPlace }),
  updateHomeAddress: (homeAddress) => set({ homeAddress }),
  updateRelationship: (relationship) =>
    set({
      relationships: new Map(getState().relationships).set(relationship.person._id, relationship),
    }),
  updateFile: (fileInfo) =>
    set({ files: new Map(getState().files).set(fileInfo.fileId, fileInfo) }),
  updateImage: (fileInfo) =>
    set({ images: new Map(getState().images).set(fileInfo.fileId, fileInfo) }),
  updateCustomField: (uid, customField) =>
    set({ customFields: new Map(getState().customFields).set(uid, customField) }),
  updateContactDetails: (uid, customField) =>
    set({ contactDetails: new Map(getState().contactDetails).set(uid, customField) }),
  updateOldName: (uid, oldName) =>
    set({ oldNames: new Map(getState().oldNames).set(uid, oldName) }),
  updateDocument: (uid, document) =>
    set({ documents: new Map(getState().documents).set(uid, document) }),
  updateEducation: (uid, education) =>
    set({ education: new Map(getState().education).set(uid, education) }),

  addRelationships: (personsIds) => {
    const relationshipsMap = getState().relationships
    personsIds.forEach((personId) =>
      relationshipsMap.set(personId, getDefaultRelationship(personId)),
    )
    set({ relationships: new Map(relationshipsMap) })
  },

  addCustomField: (fieldName: string) =>
    set({
      customFields: new Map(getState().customFields).set(v4(), getDefaultCustomField(fieldName)),
    }),
  addContactDetails: (fieldName: string) =>
    set({
      contactDetails: new Map(getState().contactDetails).set(
        v4(),
        getDefaultCustomField(fieldName),
      ),
    }),
  addOldName: () => set({ oldNames: new Map(getState().oldNames).set(v4(), getDefaultOldName()) }),

  addFile: (fileInfo) => {
    const filesMap = getState().files

    if (!filesMap.has(fileInfo.fileId)) {
      set({ files: new Map(filesMap).set(fileInfo.fileId, fileInfo) })
    }
  },

  addImage: (fileInfo) => {
    const imagesMap = getState().images

    if (!imagesMap.has(fileInfo.fileId)) {
      set({ files: new Map(imagesMap).set(fileInfo.fileId, fileInfo) })
    }
  },

  addDocument: () =>
    set({ documents: new Map(getState().documents).set(v4(), getDefaultIdDocument()) }),
  addEducation: () =>
    set({ education: new Map(getState().education).set(v4(), getDefaultEducation()) }),

  removeRelationships: (ids) =>
    set({ relationships: removeMapItems(getState().relationships, ids) }),
  removeCustomFields: (ids) => set({ customFields: removeMapItems(getState().customFields, ids) }),
  removeContactDetails: (ids) =>
    set({ contactDetails: removeMapItems(getState().contactDetails, ids) }),
  removeImages: (ids) => set({ images: removeMapItems(getState().images, ids) }),
  removeFiles: (ids) => set({ files: removeMapItems(getState().files, ids) }),
  removeDocuments: (ids) => set({ documents: removeMapItems(getState().documents, ids) }),
  removeOldNames: (ids) => set({ oldNames: removeMapItems(getState().oldNames, ids) }),
  removeEducation: (ids) => set({ education: removeMapItems(getState().education, ids) }),
}))
