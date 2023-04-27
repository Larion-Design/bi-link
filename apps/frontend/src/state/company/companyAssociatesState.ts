import { v4 } from 'uuid'
import { StateCreator } from 'zustand'
import {
  AssociateAPI,
  BooleanWithMetadata,
  CustomFieldAPI,
  NumberWithMetadata,
  OptionalDateWithMetadata,
  TextWithMetadata,
} from 'defs'
import { getDefaultCustomField } from 'tools'
import { removeMapItems } from '../utils'

export type CompanyAssociateInfoState = Omit<AssociateAPI, 'customFields'> & {
  customFields: Set<string>
}

export type CompanyAssociatesState = {
  associates: Map<string, CompanyAssociateInfoState>
  setAssociates: (associates: AssociateAPI[]) => void
  addAssociates: (associatesInfo: AssociateAPI[]) => void
  removeAssociate: (uid: string) => void
  updateAssociateEquity: (uid: string, equity: NumberWithMetadata) => void
  updateAssociateStartDate: (uid: string, startDate: OptionalDateWithMetadata) => void
  updateAssociateEndDate: (uid: string, endDate: OptionalDateWithMetadata) => void
  updateAssociateRole: (uid: string, role: TextWithMetadata) => void
  updateAssociateActive: (uid: string, isActive: BooleanWithMetadata) => void

  associatesCustomFields: Map<string, CustomFieldAPI>
  addAssociateCustomField: (associateId: string) => void
  updateAssociateCustomField: (uid: string, customField: CustomFieldAPI) => void
  removeAssociateCustomFields: (associateId: string, ids: string[]) => void
}

export const createCompanyAssociatesStore: StateCreator<
  CompanyAssociatesState,
  [],
  [],
  CompanyAssociatesState
> = (set, get) => ({
  associates: new Map(),
  associatesCustomFields: new Map(),

  setAssociates: (associates) => {
    const associatesMap = new Map<string, CompanyAssociateInfoState>()
    const associatesCustomFields = new Map<string, CustomFieldAPI>()

    associates.forEach(
      ({ metadata, person, company, startDate, endDate, customFields, equity, role, isActive }) => {
        const customFieldsSet = new Set<string>()
        customFields.forEach((customField) => {
          const customFieldId = v4()
          associatesCustomFields.set(customFieldId, customField)
          customFieldsSet.add(customFieldId)
        })

        associatesMap.set(v4(), {
          metadata,
          person,
          company,
          startDate,
          endDate,
          equity,
          role,
          isActive,
          customFields: customFieldsSet,
        })
      },
    )

    set({
      associates: associatesMap,
      associatesCustomFields,
    })
  },

  addAssociates: (associatesInfo) => {
    const associatesMap = get().associates
    const customFieldsMap = get().associatesCustomFields

    associatesInfo.forEach(
      ({ metadata, person, company, startDate, endDate, customFields, equity, role, isActive }) => {
        const customFieldsSet = new Set<string>()
        customFields.forEach((customField) => {
          const customFieldId = v4()
          customFieldsMap.set(customFieldId, customField)
          customFieldsSet.add(customFieldId)
        })

        associatesMap.set(v4(), {
          metadata,
          person,
          company,
          startDate,
          endDate,
          equity,
          role,
          isActive,
          customFields: customFieldsSet,
        })
      },
    )

    set({ associates: new Map(associatesMap), associatesCustomFields: new Map(customFieldsMap) })
  },

  updateAssociateStartDate: (uid, startDate) => {
    const associates = get().associates
    const associate = associates.get(uid)
    set({ associates: new Map(associates).set(uid, { ...associate, startDate }) })
  },

  updateAssociateEndDate: (uid, endDate) => {
    const associates = get().associates
    const associate = associates.get(uid)
    set({ associates: new Map(associates).set(uid, { ...associate, endDate }) })
  },

  updateAssociateEquity: (uid, equity) => {
    const associates = get().associates
    const associate = associates.get(uid)
    set({ associates: new Map(associates).set(uid, { ...associate, equity }) })
  },

  updateAssociateRole: (uid, role) => {
    const associates = get().associates
    const associate = associates.get(uid)
    set({ associates: new Map(associates).set(uid, { ...associate, role }) })
  },

  updateAssociateActive: (uid, isActive) => {
    const associates = get().associates
    const associate = associates.get(uid)
    set({ associates: new Map(associates).set(uid, { ...associate, isActive }) })
  },

  removeAssociate: (uid: string) => set({ associates: removeMapItems(get().associates, [uid]) }),

  addAssociateCustomField: (associateId) => {
    const uid = v4()
    const associates = get().associates
    const associate = associates.get(associateId)

    set({
      associates: new Map(associates).set(associateId, {
        ...associate,
        customFields: new Set(associate.customFields).add(uid),
      }),
      associatesCustomFields: new Map(get().associatesCustomFields).set(
        uid,
        getDefaultCustomField(),
      ),
    })
  },

  updateAssociateCustomField: (uid, fieldInfo) =>
    set({ associatesCustomFields: new Map(get().associatesCustomFields).set(uid, fieldInfo) }),

  removeAssociateCustomFields: (associateId, ids) => {
    const associates = get().associates
    const associate = associates.get(associateId)

    ids.forEach((id) => associate.customFields.delete(id))

    if (associates) {
      set({
        associates: new Map(associates).set(associateId, {
          ...associate,
          customFields: new Set(associate.customFields),
        }),
        associatesCustomFields: removeMapItems(get().associatesCustomFields, ids),
      })
    }
  },
})
