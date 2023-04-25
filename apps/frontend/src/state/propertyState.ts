import { getDefaultRealEstate, getDefaultVehicle } from 'tools'
import { v4 } from 'uuid'
import { create } from 'zustand'
import {
  BooleanWithMetadata,
  LocationAPIInput,
  NumberWithMetadata,
  Property,
  PropertyAPIInput,
  PropertyOwnerAPI,
  TextWithMetadata,
} from 'defs'

import { createCustomFieldsStore, CustomFieldsState } from './customFieldsState'
import { createFilesStore, FilesState } from './filesStore'
import { createImagesStore, ImagesState } from './imagesStore'
import { createMetadataStore, MetadataState } from './metadataStore'
import { removeMapItems } from './utils'

type PropertyState = MetadataState &
  FilesState &
  ImagesState &
  CustomFieldsState &
  Pick<Property, 'name' | 'type' | 'realEstateInfo' | 'vehicleInfo'> & {
    owners: Map<string, PropertyOwnerAPI>
    setPropertyInfo: (propertyInfo: PropertyAPIInput) => void

    updateName: (name: string) => void
    updateType: (type: string) => void

    enableVehicleInfo: () => void
    disableVehicleInfo: () => void
    enableRealEstateInfo: () => void
    disableRealEstateInfo: () => void

    updateVin: (vin: TextWithMetadata) => void
    updateVehicleModel: (model: TextWithMetadata) => void
    updateVehicleMaker: (model: TextWithMetadata) => void
    updateColor: (color: TextWithMetadata) => void

    updateRealEstateSurface: (surface: NumberWithMetadata) => void
    updateRealEstateLocation: (location: LocationAPIInput) => void
    updateRealEstateTownArea: (townArea: BooleanWithMetadata) => void

    addOwner: (ownerInfo: PropertyOwnerAPI) => void
    updateOwner: (uid: string, ownerInfo: PropertyOwnerAPI) => void
    removeOwner: (uid: string) => void
  }

export const usePropertyState = create<PropertyState>((set, get, state) => ({
  ...createMetadataStore(set, get, state),
  ...createFilesStore(set, get, state),
  ...createImagesStore(set, get, state),
  ...createCustomFieldsStore(set, get, state),

  name: '',
  type: '',
  vehicleInfo: null,
  realEstateInfo: null,
  owners: new Map(),

  setPropertyInfo: (propertyInfo) => {
    const ownersMap = new Map<string, PropertyOwnerAPI>()
    propertyInfo.owners.forEach((ownerInfo) => ownersMap.set(v4(), ownerInfo))

    set({
      name: propertyInfo.name,
      type: propertyInfo.type,
      vehicleInfo: propertyInfo.vehicleInfo,
      realEstateInfo: propertyInfo.realEstateInfo,
      owners: ownersMap,
    })

    get().updateMetadata(propertyInfo.metadata)
    get().setCustomFields(propertyInfo.customFields)
    get().setFiles(propertyInfo.files)
    get().setImages(propertyInfo.images)
  },

  enableRealEstateInfo: () => set({ realEstateInfo: getDefaultRealEstate() }),
  disableRealEstateInfo: () => set({ realEstateInfo: null }),
  enableVehicleInfo: () => set({ vehicleInfo: getDefaultVehicle() }),
  disableVehicleInfo: () => set({ vehicleInfo: null }),

  updateName: (name) => set({ name }),
  updateType: (type) => set({ type }),

  updateVin: (vin) => {
    const vehicleInfo = get().vehicleInfo

    if (vehicleInfo) {
      set({ vehicleInfo: { ...vehicleInfo, vin } })
    }
  },

  updateColor: (color) => {
    const vehicleInfo = get().vehicleInfo

    if (vehicleInfo) {
      set({ vehicleInfo: { ...vehicleInfo, color } })
    }
  },

  updateVehicleModel: (model) => {
    const vehicleInfo = get().vehicleInfo

    if (vehicleInfo) {
      set({ vehicleInfo: { ...vehicleInfo, model } })
    }
  },

  updateVehicleMaker: (maker) => {
    const vehicleInfo = get().vehicleInfo

    if (vehicleInfo) {
      set({ vehicleInfo: { ...vehicleInfo, maker } })
    }
  },

  updateRealEstateLocation: (location) => {
    const realEstateInfo = get().realEstateInfo

    if (realEstateInfo) {
      set({ realEstateInfo: { ...realEstateInfo, location } })
    }
  },

  updateRealEstateSurface: (surface) => {
    const realEstateInfo = get().realEstateInfo

    if (realEstateInfo) {
      set({ realEstateInfo: { ...realEstateInfo, surface } })
    }
  },

  updateRealEstateTownArea: (townArea) => {
    const realEstateInfo = get().realEstateInfo

    if (realEstateInfo) {
      set({ realEstateInfo: { ...realEstateInfo, townArea } })
    }
  },

  addOwner: (ownerInfo) => set({ owners: new Map(get().owners).set(v4(), ownerInfo) }),
  updateOwner: (uid, ownerInfo) => set({ owners: new Map(get().owners).set(uid, ownerInfo) }),
  removeOwner: (uid: string) => set({ owners: removeMapItems(get().owners, [uid]) }),
}))
