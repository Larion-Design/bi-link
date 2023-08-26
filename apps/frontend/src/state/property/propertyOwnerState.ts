import { v4 } from 'uuid'
import { StateCreator } from 'zustand'
import { CustomFieldAPI, OptionalDateWithMetadata, PropertyOwnerAPI, VehicleOwnerInfo } from 'defs'
import { getDefaultCustomField } from 'default-values'
import { removeMapItems } from '../utils'

export type PropertyOwnerInfoState = Omit<PropertyOwnerAPI, 'customFields'> & {
  customFields: Set<string>
}

export type PropertyOwnersState = {
  owners: Map<string, PropertyOwnerInfoState>
  setPropertyOwners: (owners: PropertyOwnerAPI[]) => void
  getOwners: () => PropertyOwnerAPI[]
  addOwners: (ownersInfo: PropertyOwnerAPI[]) => void
  removeOwner: (uid: string) => void
  updateOwnerStartDate: (uid: string, startDate: OptionalDateWithMetadata) => void
  updateOwnerEndDate: (uid: string, endDate: OptionalDateWithMetadata) => void
  setVehicleOwnerInfo: (uid: string, vehicleOwnerInfo: VehicleOwnerInfo | null) => void
  setVehicleOwnerPlateNumbers: (uid: string, plateNumbers: string[]) => void

  ownersCustomFields: Map<string, CustomFieldAPI>
  addOwnerCustomField: (uid: string) => void
  updateOwnerCustomField: (uid: string, fieldInfo: CustomFieldAPI) => void
  removeOwnerCustomFields: (ownerId: string, ids: string[]) => void
}

export const createPropertyOwnersStore: StateCreator<
  PropertyOwnersState,
  [],
  [],
  PropertyOwnersState
> = (set, get) => ({
  owners: new Map(),
  ownersCustomFields: new Map(),

  setPropertyOwners: (owners) => {
    const ownersMap = new Map<string, PropertyOwnerInfoState>()
    const ownersCustomFields = new Map<string, CustomFieldAPI>()

    owners.forEach(
      ({ metadata, person, company, startDate, endDate, customFields, vehicleOwnerInfo }) => {
        const customFieldsSet = new Set<string>()
        customFields.forEach((customField) => {
          const customFieldId = v4()
          ownersCustomFields.set(customFieldId, customField)
          customFieldsSet.add(customFieldId)
        })

        ownersMap.set(v4(), {
          metadata,
          person,
          company,
          startDate,
          endDate,
          vehicleOwnerInfo,
          customFields: customFieldsSet,
        })
      },
    )

    set({
      owners: ownersMap,
      ownersCustomFields,
    })
  },

  getOwners: () => {
    const owners = get().owners
    const ownersCustomFields = get().ownersCustomFields

    return Array.from(owners.values()).map(
      ({ startDate, endDate, metadata, person, company, customFields, vehicleOwnerInfo }) => ({
        metadata,
        startDate,
        endDate,
        person,
        company,
        vehicleOwnerInfo,
        customFields: Array.from(customFields).map((customFieldId) =>
          ownersCustomFields.get(customFieldId),
        ),
      }),
    )
  },

  addOwners: (ownersInfo) => {
    const ownersMap = get().owners
    const customFieldsMap = get().ownersCustomFields

    ownersInfo.forEach(
      ({ metadata, person, company, startDate, endDate, customFields, vehicleOwnerInfo }) => {
        const customFieldsSet = new Set<string>()
        customFields.forEach((customField) => {
          const customFieldId = v4()
          customFieldsMap.set(customFieldId, customField)
          customFieldsSet.add(customFieldId)
        })

        ownersMap.set(v4(), {
          metadata,
          person,
          company,
          startDate,
          endDate,
          vehicleOwnerInfo,
          customFields: customFieldsSet,
        })
      },
    )

    set({ owners: new Map(ownersMap), ownersCustomFields: new Map(customFieldsMap) })
  },

  updateOwnerStartDate: (uid, startDate) => {
    const owners = get().owners
    const owner = owners.get(uid)
    set({ owners: new Map(owners).set(uid, { ...owner, startDate }) })
  },

  updateOwnerEndDate: (uid, endDate) => {
    const owners = get().owners
    const owner = owners.get(uid)
    set({ owners: new Map(owners).set(uid, { ...owner, endDate }) })
  },

  setVehicleOwnerInfo: (uid, vehicleOwnerInfo) => {
    const owners = get().owners
    const owner = owners.get(uid)

    if (vehicleOwnerInfo) {
      const { plateNumbers } = vehicleOwnerInfo
      set({ owners: new Map(owners).set(uid, { ...owner, vehicleOwnerInfo: { plateNumbers } }) })
    } else {
      set({ owners: new Map(owners).set(uid, { ...owner, vehicleOwnerInfo: null }) })
    }
  },

  setVehicleOwnerPlateNumbers: (uid, plateNumbers) => {
    const owners = get().owners
    const owner = owners.get(uid)

    if (owner.vehicleOwnerInfo?.plateNumbers) {
      set({
        owners: new Map(owners).set(uid, {
          ...owner,
          vehicleOwnerInfo: {
            ...owner.vehicleOwnerInfo,
            plateNumbers: Array.from(new Set(plateNumbers)),
          },
        }),
      })
    }
  },

  removeOwner: (uid: string) => set({ owners: removeMapItems(get().owners, [uid]) }),

  addOwnerCustomField: (ownerId) => {
    const uid = v4()
    const owners = get().owners
    const owner = owners.get(ownerId)

    set({
      owners: new Map(owners).set(ownerId, {
        ...owner,
        customFields: new Set(owner.customFields).add(uid),
      }),
      ownersCustomFields: new Map(get().ownersCustomFields).set(uid, getDefaultCustomField()),
    })
  },

  updateOwnerCustomField: (uid, fieldInfo) =>
    set({ ownersCustomFields: new Map(get().ownersCustomFields).set(uid, fieldInfo) }),

  removeOwnerCustomFields: (ownerId, ids) => {
    const owners = get().owners
    const owner = owners.get(ownerId)

    ids.forEach((id) => owner.customFields.delete(id))

    if (owners) {
      set({
        owners: new Map(owners).set(ownerId, {
          ...owner,
          customFields: new Set(owner.customFields),
        }),
        ownersCustomFields: removeMapItems(get().ownersCustomFields, ids),
      })
    }
  },
})
