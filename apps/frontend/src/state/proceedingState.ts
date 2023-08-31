import { v4 } from 'uuid'
import { create } from 'zustand'
import {
  TextWithMetadata,
  ProceedingAPIInput,
  ProceedingEntityInvolvedAPI,
  OptionalDateWithMetadata,
} from 'defs'
import { getDefaultOptionalDateWithMetadata, getDefaultTextWithMetadata } from 'tools'
import { createCustomFieldsStore, CustomFieldsState } from './customFieldsState'
import { createFilesStore, FilesState } from './filesStore'
import { createMetadataStore, MetadataState } from './metadataStore'
import { addMapItems, removeMapItems } from './utils'

type ProceedingState = MetadataState &
  FilesState &
  CustomFieldsState &
  Pick<ProceedingAPIInput, 'name' | 'type' | 'reason' | 'year' | 'fileNumber' | 'description'> & {
    entitiesInvolved: Map<string, ProceedingEntityInvolvedAPI>

    setProceedingInfo: (propertyInfo: ProceedingAPIInput) => void
    getProceeding: () => ProceedingAPIInput
    getEntitiesInvolved: () => ProceedingEntityInvolvedAPI[]

    updateName: (name: string) => void
    updateType: (type: string) => void
    updateReason: (type: TextWithMetadata) => void
    updateYear: (type: OptionalDateWithMetadata) => void
    updateFileNumber: (type: TextWithMetadata) => void
    updateDescription: (description: string) => void

    addInvolvedEntities: (entities: ProceedingEntityInvolvedAPI[]) => void
    updateInvolvedEntity: (uid: string, entity: ProceedingEntityInvolvedAPI) => void
    removeInvolvedEntity: (uid: string) => void
  }

export const useProceedingState = create<ProceedingState>((set, get, state) => ({
  ...createMetadataStore(set, get, state),
  ...createFilesStore(set, get, state),
  ...createCustomFieldsStore(set, get, state),

  name: '',
  type: '',
  description: '',
  year: getDefaultOptionalDateWithMetadata(),
  reason: getDefaultTextWithMetadata(),
  fileNumber: getDefaultTextWithMetadata(),
  entitiesInvolved: new Map(),

  setProceedingInfo: (proceedingInfo) => {
    const entitiesMap = new Map<string, ProceedingEntityInvolvedAPI>()
    proceedingInfo.entitiesInvolved.forEach((ownerInfo) => entitiesMap.set(v4(), ownerInfo))

    set({
      type: proceedingInfo.type,
      description: proceedingInfo.description,
      reason: proceedingInfo.reason,
      year: proceedingInfo.year,
      fileNumber: proceedingInfo.fileNumber,
      entitiesInvolved: entitiesMap,
    })

    get().updateMetadata(proceedingInfo.metadata)
    get().setCustomFields(proceedingInfo.customFields)
    get().setFiles(proceedingInfo.files)
  },

  getProceeding: () => {
    const {
      metadata,
      name,
      type,
      description,
      year,
      reason,
      fileNumber,
      getEntitiesInvolved,
      getFiles,
      getCustomFields,
    } = get()

    return {
      metadata,
      name,
      type,
      description,
      year,
      reason,
      fileNumber,
      status: getDefaultTextWithMetadata(),
      entitiesInvolved: getEntitiesInvolved(),
      files: getFiles(),
      customFields: getCustomFields(),
    }
  },

  getEntitiesInvolved: () => Array.from(get().entitiesInvolved.values()),

  updateDescription: (description) => set({ description }),
  updateType: (type) => set({ type }),
  updateReason: (reason) => set({ reason }),
  updateName: (name) => set({ name }),
  updateYear: (year) => set({ year }),
  updateFileNumber: (fileNumber) => set({ fileNumber }),

  addInvolvedEntities: (entities) =>
    set({ entitiesInvolved: addMapItems(get().entitiesInvolved, entities) }),
  updateInvolvedEntity: (uid, entity) =>
    set({ entitiesInvolved: new Map(get().entitiesInvolved).set(uid, entity) }),
  removeInvolvedEntity: (uid) =>
    set({ entitiesInvolved: removeMapItems(get().entitiesInvolved, [uid]) }),
}))
