import { getDefaultCustomField } from 'tools'
import { v4 } from 'uuid'
import { StateCreator } from 'zustand'
import { CustomFieldAPI } from 'defs'
import { removeMapItems } from './utils'

export type CustomFieldsState = {
  customFields: Map<string, CustomFieldAPI>
  updateCustomField: (uid: string, customField: CustomFieldAPI) => void
  addCustomField: (fieldName: string) => void
  removeCustomFields: (ids: string[]) => void
  setCustomFields: (customFields: CustomFieldAPI[]) => void
  getCustomFields: () => CustomFieldAPI[]
}

export const createCustomFieldsStore: StateCreator<CustomFieldsState, [], [], CustomFieldsState> = (
  set,
  get,
) => ({
  customFields: new Map(),

  setCustomFields: (customFields) => {
    const customFieldsMap = new Map<string, CustomFieldAPI>()
    customFields.forEach((customField) => customFieldsMap.set(v4(), customField))
    set({ customFields: customFieldsMap })
  },

  updateCustomField: (uid, customField) =>
    set({ customFields: new Map(get().customFields).set(uid, customField) }),

  addCustomField: (fieldName: string) =>
    set({
      customFields: new Map(get().customFields).set(v4(), getDefaultCustomField(fieldName)),
    }),

  removeCustomFields: (ids) => set({ customFields: removeMapItems(get().customFields, ids) }),

  getCustomFields: () => Array.from(get().customFields.values()),
})
