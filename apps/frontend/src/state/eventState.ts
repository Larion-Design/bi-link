import { v4 } from 'uuid'
import { create } from 'zustand'
import {
  LocationAPIInput,
  EventAPIInput,
  TextWithMetadata,
  EventParticipantAPI,
  OptionalDateWithMetadata,
  CustomFieldAPI,
} from 'defs'
import {
  getDefaultCustomField,
  getDefaultLocation,
  getDefaultMetadata,
  getDefaultOptionalDateWithMetadata,
  getDefaultTextWithMetadata,
} from 'tools'
import { createCustomFieldsStore, CustomFieldsState } from './customFieldsState'
import { createFilesStore, FilesState } from './filesStore'
import { createMetadataStore, MetadataState } from './metadataStore'
import { removeMapItems } from './utils'

type EventParticipant = Omit<
  EventParticipantAPI,
  'persons' | 'companies' | 'properties' | 'customFields'
> & {
  persons: Set<string>
  companies: Set<string>
  properties: Set<string>
  customFields: Set<string>
}

type EventState = MetadataState &
  FilesState &
  CustomFieldsState &
  Pick<EventAPIInput, 'type' | 'description' | 'date' | 'location'> & {
    parties: Map<string, EventParticipant>
    participantsCustomFields: Map<string, CustomFieldAPI>

    setEventInfo: (propertyInfo: EventAPIInput) => void

    getEvent: () => EventAPIInput
    getParticipants: () => EventParticipantAPI[]

    updateType: (type: TextWithMetadata) => void
    updateDescription: (description: string) => void
    updateDate: (type: OptionalDateWithMetadata) => void
    updateLocation: (location: LocationAPIInput) => void

    addParticipant: () => void
    removeParticipant: (id: string) => void

    setParticipantPersons: (uid: string, personsIds: string[]) => void
    setParticipantCompanies: (uid: string, companiesIds: string[]) => void
    setParticipantProperties: (uid: string, propertiesIds: string[]) => void

    updateParticipantType: (uid: string, type: string) => void
    updateParticipantDescription: (uid: string, description: string) => void

    addParticipantCustomField: (participantId: string) => void
    removeParticipantCustomFields: (participantId: string, customFieldsIds: string[]) => void
    updateParticipantCustomField: (customFieldId: string, customFieldInfo: CustomFieldAPI) => void
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
  participantsCustomFields: new Map(),

  setEventInfo: (eventInfo) => {
    const participantsCustomFields = new Map<string, CustomFieldAPI>()
    const participantsMap = new Map<string, EventParticipant>()
    eventInfo.parties.forEach((participantInfo) => {
      const customFields = new Set<string>()
      participantInfo.customFields.forEach((customField) => {
        const uid = v4()
        customFields.add(uid)
        participantsCustomFields.set(uid, customField)
      })

      participantsMap.set(v4(), {
        metadata: participantInfo.metadata,
        type: participantInfo.type,
        description: participantInfo.type,
        persons: new Set(participantInfo.persons.map(({ _id }) => _id)),
        companies: new Set(participantInfo.companies.map(({ _id }) => _id)),
        properties: new Set(participantInfo.properties.map(({ _id }) => _id)),
        customFields,
      })
    })

    set({
      type: eventInfo.type,
      description: eventInfo.description,
      date: eventInfo.date,
      location: eventInfo.location,
      parties: participantsMap,
      participantsCustomFields,
    })

    get().updateMetadata(eventInfo.metadata)
    get().setCustomFields(eventInfo.customFields)
    get().setFiles(eventInfo.files)
  },

  getEvent: () => {
    const {
      metadata,
      type,
      date,
      location,
      description,
      getCustomFields,
      getFiles,
      getParticipants,
    } = get()

    return {
      metadata,
      type,
      date,
      location,
      description,
      parties: getParticipants(),
      customFields: getCustomFields(),
      files: getFiles(),
    }
  },

  getParticipants: () => {
    const eventParticipants = get().parties
    const customFields = get().participantsCustomFields

    return Array.from(eventParticipants.values()).map((participantInfo) => ({
      metadata: participantInfo.metadata,
      type: participantInfo.type,
      description: participantInfo.description,
      customFields: Array.from(participantInfo.customFields).map((customFieldId) =>
        customFields.get(customFieldId),
      ),
      persons: Array.from(participantInfo.persons).map((_id) => ({ _id })),
      companies: Array.from(participantInfo.companies).map((_id) => ({ _id })),
      properties: Array.from(participantInfo.properties).map((_id) => ({ _id })),
    }))
  },

  addParticipant: () =>
    set({
      parties: new Map(get().parties).set(v4(), {
        metadata: getDefaultMetadata(),
        type: '',
        description: '',
        companies: new Set(),
        persons: new Set(),
        properties: new Set(),
        customFields: new Set(),
      }),
    }),

  setParticipantPersons: (uid, ids) => {
    const participants = get().parties
    const participant = participants.get(uid)
    set({ parties: new Map(participants.set(uid, { ...participant, persons: new Set(ids) })) })
  },

  setParticipantCompanies: (uid, ids) => {
    const participants = get().parties
    const participant = participants.get(uid)
    set({ parties: new Map(participants.set(uid, { ...participant, companies: new Set(ids) })) })
  },

  setParticipantProperties: (uid, ids) => {
    const participants = get().parties
    const participant = participants.get(uid)
    set({ parties: new Map(participants.set(uid, { ...participant, properties: new Set(ids) })) })
  },

  updateDate: (date) => set({ date }),
  updateLocation: (location) => set({ location }),
  updateDescription: (description) => set({ description }),
  updateType: (type) => set({ type }),
  updateParticipantCustomField: (customFieldId, customFieldInfo) =>
    set({
      participantsCustomFields: new Map(get().participantsCustomFields).set(
        customFieldId,
        customFieldInfo,
      ),
    }),
  updateParticipantType: (uid, type) => {
    const participants = get().parties
    const participant = participants.get(uid)
    set({ parties: new Map().set(uid, { ...participant, type }) })
  },
  updateParticipantDescription: (uid, description) => {
    const participants = get().parties
    const participant = participants.get(uid)
    set({ parties: new Map().set(uid, { ...participant, description }) })
  },

  addParticipantCustomField: (participantId) => {
    const uid = v4()
    const participants = get().parties
    const participant = participants.get(participantId)
    const customFields = new Set(participant.customFields)

    set({
      parties: new Map(participants.set(participantId, { ...participant, customFields })),
      participantsCustomFields: new Map(get().participantsCustomFields).set(
        uid,
        getDefaultCustomField(),
      ),
    })
  },

  removeParticipantCustomFields: (participantId, customFieldsIds) => {
    const participants = get().parties
    const participant = participants.get(participantId)
    const customFields = new Set(participant.customFields)
    const participantsCustomFields = get().participantsCustomFields

    customFieldsIds.forEach((uid) => {
      customFields.delete(uid)
      participantsCustomFields.delete(uid)
    })

    set({
      parties: new Map(participants.set(participantId, { ...participant, customFields })),
      participantsCustomFields: new Map(participantsCustomFields),
    })
  },

  removeParticipant: (uid) => set({ parties: removeMapItems(get().parties, [uid]) }),
}))
