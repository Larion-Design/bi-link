export interface Location {
  address: string
  isActive: boolean
}

export interface LocationAPIInput extends Location {}
export interface LocationAPIOutput extends Location {}

export type LocationIndex = Location['address']
