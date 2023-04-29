import { getDefaultCustomField } from 'tools'
import { v4 } from 'uuid'
import { StateCreator } from 'zustand'
import { CustomFieldAPI } from 'defs'
import { removeMapItems } from './utils'

export type ContactDetailsState = {
  contactDetails: Map<string, CustomFieldAPI>
  updateContactDetails: (uid: string, customField: CustomFieldAPI) => void
  addContactDetails: (fieldName: string) => void
  removeContactDetails: (ids: string[]) => void
  setContactDetails: (customFields: CustomFieldAPI[]) => void
  getContactDetails: () => CustomFieldAPI[]
}

export const createContactDetailsStore: StateCreator<
  ContactDetailsState,
  [],
  [],
  ContactDetailsState
> = (set, get) => ({
  contactDetails: new Map(),

  setContactDetails: (customFields) => {
    const customFieldsMap = new Map<string, CustomFieldAPI>()
    customFields.forEach((customField) => customFieldsMap.set(v4(), customField))
    set({ contactDetails: customFieldsMap })
  },

  updateContactDetails: (uid, customField) =>
    set({ contactDetails: new Map(get().contactDetails).set(uid, customField) }),

  addContactDetails: (fieldName: string) =>
    set({
      contactDetails: new Map(get().contactDetails).set(v4(), getDefaultCustomField(fieldName)),
    }),

  removeContactDetails: (ids) => set({ contactDetails: removeMapItems(get().contactDetails, ids) }),

  getContactDetails: () => Array.from(get().contactDetails.values()),
})
