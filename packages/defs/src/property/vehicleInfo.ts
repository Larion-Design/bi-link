export interface VehicleInfo {
  vin: string
  maker: string
  model: string
  color: string
}

export interface VehicleInfoAPIInput extends VehicleInfo {}
export interface VehicleInfoAPIOutput extends VehicleInfo {}
