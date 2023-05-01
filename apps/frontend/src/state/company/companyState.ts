import { v4 } from 'uuid'
import { create } from 'zustand'
import { AssociateAPI, CompanyAPIInput, LocationAPIInput, TextWithMetadata } from 'defs'
import { getDefaultLocation, getDefaultTextWithMetadata } from 'tools'
import { CompanyAssociatesState, createCompanyAssociatesStore } from './companyAssociatesState'
import { createContactDetailsStore, ContactDetailsState } from '../contactDetailsState'
import { createCustomFieldsStore, CustomFieldsState } from '../customFieldsState'
import { createFilesStore, FilesState } from '../filesStore'
import { createMetadataStore, MetadataState } from '../metadataStore'
import { removeMapItems } from '../utils'

type CompanyState = MetadataState &
  FilesState &
  CustomFieldsState &
  ContactDetailsState &
  CompanyAssociatesState & {
    setCompanyInfo: (company: CompanyAPIInput) => void
    getCompany: () => CompanyAPIInput

    name: TextWithMetadata
    cui: TextWithMetadata
    registrationNumber: TextWithMetadata
    headquarters: LocationAPIInput
    locations: Map<string, LocationAPIInput>

    updateName: (name: TextWithMetadata) => void
    updateCui: (cui: TextWithMetadata) => void
    updateRegistrationNumber: (registrationNumber: TextWithMetadata) => void
    updateHeadquarters: (headquarters: LocationAPIInput) => void
    updateBranch: (uid: string, branch: LocationAPIInput) => void

    addBranch: () => void
    removeBranches: (ids: string[]) => void

    getBranches: () => LocationAPIInput[]
  }

export const useCompanyState = create<CompanyState>((set, get, state) => ({
  ...createMetadataStore(set, get, state),
  ...createFilesStore(set, get, state),
  ...createCustomFieldsStore(set, get, state),
  ...createContactDetailsStore(set, get, state),
  ...createCompanyAssociatesStore(set, get, state),

  name: getDefaultTextWithMetadata(),
  cui: getDefaultTextWithMetadata(),
  registrationNumber: getDefaultTextWithMetadata(),
  headquarters: getDefaultLocation(),
  locations: new Map(),

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
    })

    get().setAssociates(company.associates)
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

  addBranch: () => set({ locations: new Map(get().locations).set(v4(), getDefaultLocation()) }),
  removeBranches: (ids) => set({ locations: removeMapItems(get().locations, ids) }),

  getBranches: () => Array.from(get().locations.values()),

  getCompany: () => {
    const {
      metadata,
      name,
      cui,
      registrationNumber,
      headquarters,

      getCustomFields,
      getFiles,
      getContactDetails,
      getAssociates,
      getBranches,
    } = get()

    return {
      metadata,
      name,
      cui,
      registrationNumber,
      headquarters,
      locations: getBranches(),
      files: getFiles(),
      customFields: getCustomFields(),
      contactDetails: getContactDetails(),
      associates: getAssociates(),
    }
  },
}))
