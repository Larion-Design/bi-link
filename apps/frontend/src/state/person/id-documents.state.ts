import { getDefaultIdDocument } from 'default-values'
import { v4 } from 'uuid'
import { StateCreator } from 'zustand'
import { IdDocumentAPI } from 'defs'
import { removeMapItems } from '../utils'

export type IdDocumentsState<T = IdDocumentAPI> = {
  idDocuments: Map<string, T>
  updateIdDocument: (uid: string, idDocument: T) => void
  addIdDocuments: (fieldName: string) => void
  removeIdDocuments: (ids: string[]) => void
  setIdDocuments: (idDocuments: T[]) => void
  getIdDocuments: () => T[]
}

export const createIdDocumentsStore: StateCreator<IdDocumentsState, [], [], IdDocumentsState> = (
  set,
  get,
) => ({
  idDocuments: new Map(),

  setIdDocuments: (idDocuments) => {
    const map = new Map<string, IdDocumentAPI>()
    idDocuments.forEach((idDocument) => map.set(v4(), idDocument))
    set({ idDocuments: map })
  },

  updateIdDocument: (uid, idDocument) =>
    set({ idDocuments: new Map(get().idDocuments).set(uid, idDocument) }),

  addIdDocuments: (fieldName: string) =>
    set({
      idDocuments: new Map(get().idDocuments).set(v4(), getDefaultIdDocument(fieldName)),
    }),

  removeIdDocuments: (ids) => {
    set({ idDocuments: removeMapItems(get().idDocuments, ids) })
  },

  getIdDocuments: () => Array.from(get().idDocuments.values()),
})
