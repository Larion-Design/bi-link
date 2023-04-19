import { v4 } from 'uuid'
import { create } from 'zustand'
import { AssociateAPI, CompanyAPIInput, LocationAPIInput, TextWithMetadata } from 'defs'
import { getDefaultLocation, getDefaultTextWithMetadata } from 'tools'
import { createContactDetailsStore, ContactDetailsState } from './contactDetailsState'
import { createCustomFieldsStore, CustomFieldsState } from './customFieldsState'
import { createFilesStore, FilesState } from './filesStore'
import { createImagesStore, ImagesState } from './imagesStore'
import { createMetadataStore, MetadataState } from './metadataStore'
import { removeMapItems } from './utils'

type CompanyState = MetadataState &
  FilesState &
  ImagesState &
  CustomFieldsState &
  ContactDetailsState & {
    setCompanyInfo: (company: CompanyAPIInput) => void

    name: TextWithMetadata
    cui: TextWithMetadata
    registrationNumber: TextWithMetadata
    headquarters: LocationAPIInput
    locations: Map<string, LocationAPIInput>
    associates: Map<string, AssociateAPI>

    updateName: (name: TextWithMetadata) => void
    updateCui: (cui: TextWithMetadata) => void
    updateRegistrationNumber: (registrationNumber: TextWithMetadata) => void
    updateHeadquarters: (headquarters: LocationAPIInput) => void
    updateBranch: (uid: string, branch: LocationAPIInput) => void
    updateAssociate: (uid: string, associate: AssociateAPI) => void

    addAssociate: (associate: AssociateAPI) => void
    addBranch: (location: LocationAPIInput) => void

    removeAssociates: (ids: string[]) => void
    removeBranches: (ids: string[]) => void
  }

export const useCompanyState = create<CompanyState>((set, get, state) => ({
  ...createMetadataStore(set, get, state),
  ...createFilesStore(set, get, state),
  ...createImagesStore(set, get, state),
  ...createCustomFieldsStore(set, get, state),
  ...createContactDetailsStore(set, get, state),

  name: getDefaultTextWithMetadata(),
  cui: getDefaultTextWithMetadata(),
  registrationNumber: getDefaultTextWithMetadata(),
  headquarters: getDefaultLocation(),
  locations: new Map(),
  associates: new Map(),

  setCompanyInfo: (company) => {
    const associatesMap = new Map<string, AssociateAPI>()
    company.associates.forEach((associate) => associatesMap.set(v4(), associate))

    const locationsMap = new Map<string, LocationAPIInput>()
    company.locations.forEach((location) => locationsMap.set(v4(), location))

    set({
      name: company.name,
      cui: company.cui,
      registrationNumber: company.registrationNumber,
      locations: locationsMap,
      associates: associatesMap,
    })

    get().setFiles(company.files)
    get().setCustomFields(company.customFields)
    get().setContactDetails(company.contactDetails)
    get().updateMetadata(company.metadata)
  },

  updateName: (name) => set({ name }),
  updateCui: (cui) => set({ cui }),
  updateRegistrationNumber: (registrationNumber) => set({ registrationNumber }),
  updateBranch: (uid, branch) => set({ locations: new Map(get().locations).set(uid, branch) }),
  updateHeadquarters: (headquarters) => set({ headquarters }),
  updateAssociate: (uid, associate) =>
    set({ associates: new Map(get().associates).set(uid, associate) }),

  addAssociate: (associate) => set({ associates: new Map(get().associates).set(v4(), associate) }),
  addBranch: (location) => set({ locations: new Map(get().locations).set(v4(), location) }),

  removeAssociates: (ids) => set({ associates: removeMapItems(get().associates, ids) }),
  removeBranches: (ids) => set({ locations: removeMapItems(get().locations, ids) }),
}))
