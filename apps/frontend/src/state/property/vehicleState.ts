import { TextWithMetadata, VehicleInfoAPI } from 'defs'
import { getDefaultVehicle } from 'tools'
import { StateCreator } from 'zustand'

export type VehicleInfoState = {
  vehicleInfo: VehicleInfoAPI | null
  updateVin: (vin: TextWithMetadata) => void
  updateVehicleModel: (model: TextWithMetadata) => void
  updateVehicleMaker: (model: TextWithMetadata) => void
  updateColor: (color: TextWithMetadata) => void

  enableVehicleInfo: () => void
  disableVehicleInfo: () => void

  setVehicleInfo: (vehicleInfo: VehicleInfoAPI | null) => void
}

export const createVehicleInfoStore: StateCreator<VehicleInfoState, [], [], VehicleInfoState> = (
  set,
  get,
) => ({
  vehicleInfo: null,

  setVehicleInfo: (vehicleInfo) => {
    if (vehicleInfo) {
      const { vin, model, maker, color } = vehicleInfo
      set({ vehicleInfo: { vin, model, maker, color } })
    } else set({ vehicleInfo: null })
  },

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

  enableVehicleInfo: () => set({ vehicleInfo: getDefaultVehicle() }),
  disableVehicleInfo: () => set({ vehicleInfo: null }),
})
