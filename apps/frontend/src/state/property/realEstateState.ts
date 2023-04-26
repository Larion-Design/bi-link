import { BooleanWithMetadata, LocationAPIInput, NumberWithMetadata, RealEstateInfo } from 'defs'
import { getDefaultRealEstate } from 'tools'
import { StateCreator } from 'zustand'

export type RealEstateInfoState = {
  realEstateInfo: RealEstateInfo | null

  enableRealEstateInfo: () => void
  disableRealEstateInfo: () => void

  setRealEstateInfo: (realEstateInfo: RealEstateInfo | null) => void

  updateRealEstateSurface: (surface: NumberWithMetadata) => void
  updateRealEstateLocation: (location: LocationAPIInput) => void
  updateRealEstateTownArea: (townArea: BooleanWithMetadata) => void
}

export const createRealEstateStore: StateCreator<
  RealEstateInfoState,
  [],
  [],
  RealEstateInfoState
> = (set, get, state) => ({
  realEstateInfo: null,

  setRealEstateInfo: (realEstateInfo) => {
    if (realEstateInfo) {
      const { location, surface, townArea } = realEstateInfo
      set({ realEstateInfo: { location, surface, townArea } })
    } else set({ realEstateInfo: null })
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

  enableRealEstateInfo: () => set({ realEstateInfo: getDefaultRealEstate() }),
  disableRealEstateInfo: () => set({ realEstateInfo: null }),
})
