import { create } from 'zustand'
import { PropertyAPIInput, PropertyOwnerAPI } from 'defs'
import { createCustomFieldsStore, CustomFieldsState } from '../customFieldsState'
import { createFilesStore, FilesState } from '../filesStore'
import { createImagesStore, ImagesState } from '../imagesStore'
import { createMetadataStore, MetadataState } from '../metadataStore'
import { createPropertyOwnersStore, PropertyOwnersState } from './propertyOwnerState'
import { createRealEstateStore, RealEstateInfoState } from './realEstateState'
import { createVehicleInfoStore, VehicleInfoState } from './vehicleState'

type PropertyOwner = Omit<PropertyOwnerAPI, 'customFields'> & {
  customFields: Set<string>
}

type PropertyState = MetadataState &
  FilesState &
  ImagesState &
  CustomFieldsState &
  VehicleInfoState &
  RealEstateInfoState &
  PropertyOwnersState &
  Pick<PropertyAPIInput, 'name' | 'type'> & {
    owners: Map<string, PropertyOwner>
    setPropertyInfo: (propertyInfo: PropertyAPIInput) => void
    updateName: (name: string) => void
    updateType: (type: string) => void
  }

export const usePropertyState = create<PropertyState>((set, get, state) => ({
  ...createMetadataStore(set, get, state),
  ...createFilesStore(set, get, state),
  ...createImagesStore(set, get, state),
  ...createCustomFieldsStore(set, get, state),
  ...createVehicleInfoStore(set, get, state),
  ...createRealEstateStore(set, get, state),
  ...createPropertyOwnersStore(set, get, state),

  name: '',
  type: '',
  owners: new Map(),
  ownersCustomFields: new Map(),

  setPropertyInfo: (propertyInfo) => {
    get().updateMetadata(propertyInfo.metadata)
    get().setCustomFields(propertyInfo.customFields)
    get().setFiles(propertyInfo.files)
    get().setImages(propertyInfo.images)
    get().setVehicleInfo(propertyInfo.vehicleInfo)
    get().setRealEstateInfo(propertyInfo.realEstateInfo)
    get().setPropertyOwners(propertyInfo.owners)
  },

  updateName: (name) => set({ name }),
  updateType: (type) => set({ type }),
}))
