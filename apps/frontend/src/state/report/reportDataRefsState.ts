import md5 from 'crypto-js/md5'
import {
  CompanyAPIOutput,
  ConnectedEntity,
  DataRefAPI,
  EntityInfo,
  EventAPIOutput,
  LocationAPIOutput,
  PersonAPIOutput,
  ProceedingAPIOutput,
  PropertyAPIOutput,
} from 'defs'
import { StateCreator } from 'zustand'
import { removeMapItems } from '../utils'

type RefsDataSources = {
  persons: Map<string, PersonAPIOutput>
  companies: Map<string, CompanyAPIOutput>
  events: Map<string, EventAPIOutput>
  properties: Map<string, PropertyAPIOutput>
  proceedings: Map<string, ProceedingAPIOutput>
  locations: Map<string, LocationAPIOutput>
}

export type ReportDataRefsState = {
  refs: Map<string, DataRefAPI>
  setDataRefs: (refs: DataRefAPI[]) => void
  addDataRef: (entityInfo: EntityInfo, field: string, path?: string, targetId?: string) => string
  removeDataRef: (uid: string) => void
  removeRefsExcept: (refsIds: string[]) => void
  getDataRefs: () => DataRefAPI[]
  computedDataRefsValues: Map<string, string>
  setDataRefComputedValue: (sources: RefsDataSources) => void
  computeRefsValues: (text: string) => string
}

export const createDataRefStore: StateCreator<ReportDataRefsState, [], [], ReportDataRefsState> = (
  set,
  get,
  state,
) => ({
  refs: new Map(),
  computedDataRefsValues: new Map(),
  addDataRef: ({ entityType, entityId }, field, path, targetId) => {
    const refId = md5(
      `${entityType}-${entityId}-${field}-${path ?? ''}-${targetId ?? ''}`,
    ).toString()

    const refs = get().refs

    if (!refs.has(refId)) {
      const dataRef: DataRefAPI = {
        _id: refId,
        field,
        path,
        targetId,
      }

      const entity: ConnectedEntity = { _id: entityId }

      switch (entityType) {
        case 'PERSON': {
          dataRef.person = entity
          break
        }
        case 'COMPANY': {
          dataRef.company = entity
          break
        }
        case 'PROPERTY': {
          dataRef.property = entity
          break
        }
        case 'EVENT': {
          dataRef.event = entity
          break
        }
      }
      set({ refs: new Map(get().refs).set(refId, dataRef) })
    }
    return refId
  },
  removeDataRef: (uid) => set({ refs: removeMapItems(get().refs, [uid]) }),
  getDataRefs: () => Array.from(get().refs.values()),
  setDataRefs: (refs) => {
    const dataRefs = new Map<string, DataRefAPI>()
    refs.forEach((dataRef) => dataRefs.set(dataRef._id, dataRef))
    set({ refs: dataRefs })
  },
  setDataRefComputedValue: ({ persons, companies, events, properties, proceedings, locations }) => {
    const { refs } = get()
    const computedDataRefsValues = new Map<string, string>()

    refs.forEach(
      ({ person, company, property, proceeding, event, location, path, targetId, field }, key) => {
        if (person?._id) {
          const personInfo = persons.get(person._id)
        } else if (company?._id) {
          const companyInfo = companies.get(company._id)
        }
        computedDataRefsValues.set(key, '')
      },
    )
    set({ computedDataRefsValues })
  },

  computeRefsValues: (text: string) => {
    if (!text.length) return ''

    const computedDataRefsValues = get().computedDataRefsValues

    let missingRef = false
    const transformedText = text.replaceAll(/[^{]+(?=}})/gm, (refId) => {
      if (!missingRef) {
        if (computedDataRefsValues.has(refId)) {
          return computedDataRefsValues.get(refId)
        } else missingRef = true
      }
      return refId
    })

    return missingRef ? text : transformedText.replace(/{{|}}/gm, '')
  },

  removeRefsExcept: (refsIds) => {
    const { refs, computedDataRefsValues } = get()
    const allRefsIds = new Set(refsIds)

    refs.forEach((value, key) => {
      if (!allRefsIds.has(key)) {
        refs.delete(key)
        computedDataRefsValues.delete(key)
      }
    })

    set({ refs: new Map(refs), computedDataRefsValues: new Map(computedDataRefsValues) })
  },

  extractRefsIds: (text: string) => {
    const { refs } = get()
    const set = new Set<string>()
    text.match(/[^{]+(?=}})/gm)?.forEach((refId) => {
      if (refs.has(refId)) {
        set.add(refId)
      }
    })
    return set
  },
})
