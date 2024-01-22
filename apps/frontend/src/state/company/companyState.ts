import {
  CompanyRelationshipsState,
  createCompanyRelationshipsStore,
} from 'state/company/company-relationships.state'
import { createImagesStore, ImagesState } from 'state/imagesStore'
import { v4 } from 'uuid'
import { create } from 'zustand'
import {
  AssociateAPI,
  CompanyAPIInput,
  LocationAPIInput,
  OptionalDateWithMetadata,
  TextWithMetadata,
} from 'defs'
import {
  getDefaultBooleanWithMetadata,
  getDefaultLocation,
  getDefaultOptionalDateWithMetadata,
  getDefaultTextWithMetadata,
} from 'default-values'
import { CompanyAssociatesState, createCompanyAssociatesStore } from './companyAssociatesState'
import { createContactDetailsStore, ContactDetailsState } from '../contactDetailsState'
import { createCustomFieldsStore, CustomFieldsState } from '../customFieldsState'
import { createFilesStore, FilesState } from '../filesStore'
import { createMetadataStore, MetadataState } from '../metadataStore'
import { removeMapItems } from '../utils'

type CompanyState = MetadataState &
  ImagesState &
  FilesState &
  CustomFieldsState &
  ContactDetailsState &
  CompanyAssociatesState &
  CompanyRelationshipsState & {
    setCompanyInfo: (company: CompanyAPIInput) => void
    getCompany: () => CompanyAPIInput

    name: TextWithMetadata
    cui: TextWithMetadata
    registrationNumber: TextWithMetadata
    registrationDate: OptionalDateWithMetadata
    headquarters: LocationAPIInput
    locations: Map<string, LocationAPIInput>

    updateName: (name: TextWithMetadata) => void
    updateCui: (cui: TextWithMetadata) => void
    updateRegistrationNumber: (registrationNumber: TextWithMetadata) => void
    updateRegistrationDate: (registrationDate: OptionalDateWithMetadata) => void
    updateHeadquarters: (headquarters: LocationAPIInput) => void
    updateBranch: (uid: string, branch: LocationAPIInput) => void

    addBranch: () => void
    removeBranches: (ids: string[]) => void

    getBranches: () => LocationAPIInput[]
  }

export const useSecondaryCompanyState = create<CompanyState>((set, get, state) => ({
  ...createMetadataStore(set, get, state),
  ...createFilesStore(set, get, state),
  ...createImagesStore(set, get, state),
  ...createCustomFieldsStore(set, get, state),
  ...createContactDetailsStore(set, get, state),
  ...createCompanyAssociatesStore(set, get, state),
  ...createCompanyRelationshipsStore(set, get, state),

  name: getDefaultTextWithMetadata(),
  cui: getDefaultTextWithMetadata(),
  registrationNumber: getDefaultTextWithMetadata(),
  registrationDate: getDefaultOptionalDateWithMetadata(),
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
  updateRegistrationDate: (registrationDate) => set({ registrationDate }),
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
      registrationDate,
      headquarters,

      getCustomFields,
      getFiles,
      getContactDetails,
      getAssociates,
      getBranches,
      getRelationships,
    } = get()

    return {
      metadata,
      name,
      cui,
      registrationNumber,
      registrationDate,
      headquarters,
      status: {
        vat: getDefaultTextWithMetadata(),
        fiscal: getDefaultTextWithMetadata(),
      },
      locations: getBranches(),
      files: getFiles(),
      customFields: getCustomFields(),
      contactDetails: getContactDetails(),
      associates: getAssociates(),
      balanceSheets: [],
      active: {
        ministryOfFinance: getDefaultBooleanWithMetadata(),
        tradeRegister: getDefaultBooleanWithMetadata(),
      },
      activityCodes: [],
      relationships: getRelationships(),
    }
  },
}))

export const useCompanyState = create<CompanyState>((set, get, state) => ({
  ...createMetadataStore(set, get, state),
  ...createFilesStore(set, get, state),
  ...createImagesStore(set, get, state),
  ...createCustomFieldsStore(set, get, state),
  ...createContactDetailsStore(set, get, state),
  ...createCompanyAssociatesStore(set, get, state),
  ...createCompanyRelationshipsStore(set, get, state),

  name: getDefaultTextWithMetadata(),
  cui: getDefaultTextWithMetadata(),
  registrationNumber: getDefaultTextWithMetadata(),
  registrationDate: getDefaultOptionalDateWithMetadata(),
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
  updateRegistrationDate: (registrationDate) => set({ registrationDate }),
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
      registrationDate,
      headquarters,

      getCustomFields,
      getFiles,
      getContactDetails,
      getAssociates,
      getBranches,
      getRelationships,
    } = get()

    return {
      metadata,
      name,
      cui,
      registrationNumber,
      registrationDate,
      headquarters,
      status: {
        vat: getDefaultTextWithMetadata(),
        fiscal: getDefaultTextWithMetadata(),
      },
      locations: getBranches(),
      files: getFiles(),
      customFields: getCustomFields(),
      contactDetails: getContactDetails(),
      associates: getAssociates(),
      balanceSheets: [],
      active: {
        ministryOfFinance: getDefaultBooleanWithMetadata(),
        tradeRegister: getDefaultBooleanWithMetadata(),
      },
      activityCodes: [],
      relationships: getRelationships(),
    }
  },
}))
