import { v4 } from 'uuid'
import { create } from 'zustand'
import {
  LocationAPIInput,
  EventAPIInput,
  TextWithMetadata,
  EventParticipantAPI,
  OptionalDateWithMetadata,
} from 'defs'
import {
  getDefaultLocation,
  getDefaultOptionalDateWithMetadata,
  getDefaultTextWithMetadata,
} from 'tools'
import { createCustomFieldsStore, CustomFieldsState } from './customFieldsState'
import { createFilesStore, FilesState } from './filesStore'
import { createMetadataStore, MetadataState } from './metadataStore'
import { removeMapItems } from './utils'

type EventState = MetadataState &
  FilesState &
  CustomFieldsState &
  Pick<EventAPIInput, 'type' | 'description' | 'date' | 'location'> & {
    parties: Map<string, EventParticipantAPI>

    setEventInfo: (propertyInfo: EventAPIInput) => void

    updateType: (type: TextWithMetadata) => void
    updateDescription: (description: string) => void
    updateDate: (type: OptionalDateWithMetadata) => void
    updateLocation: (location: LocationAPIInput) => void

    addParticipant: (ownerInfo: EventParticipantAPI) => void
    updateParticipant: (uid: string, ownerInfo: EventParticipantAPI) => void
    removeParticipants: (ids: string[]) => void
  }

export const useEventState = create<EventState>((set, get, state) => ({
  ...createMetadataStore(set, get, state),
  ...createFilesStore(set, get, state),
  ...createCustomFieldsStore(set, get, state),

  type: getDefaultTextWithMetadata(),
  description: '',
  date: getDefaultOptionalDateWithMetadata(),
  location: getDefaultLocation(),
  parties: new Map(),

  setEventInfo: (eventInfo) => {
    const participantsMap = new Map<string, EventParticipantAPI>()
    eventInfo.parties.forEach((ownerInfo) => participantsMap.set(v4(), ownerInfo))

    set({
      type: eventInfo.type,
      description: eventInfo.description,
      date: eventInfo.date,
      location: eventInfo.location,
      parties: participantsMap,
    })

    get().updateMetadata(eventInfo.metadata)
    get().setCustomFields(eventInfo.customFields)
    get().setFiles(eventInfo.files)
  },

  updateDate: (date) => set({ date }),
  updateLocation: (location) => set({ location }),
  updateDescription: (description) => set({ description }),
  updateType: (type) => set({ type }),

  addParticipant: (participantInfo) =>
    set({ parties: new Map(get().parties).set(v4(), participantInfo) }),
  updateParticipant: (uid, participantInfo) =>
    set({ parties: new Map(get().parties).set(uid, participantInfo) }),
  removeParticipants: (ids: string[]) => set({ parties: removeMapItems(get().parties, ids) }),
}))
