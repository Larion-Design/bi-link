import { Person } from './person'
import { Company } from './company'
import { IdDocument } from './idDocument'
import { Property, VehicleInfo } from './property'

export interface ConnectedEntity {
  _id: string
  _confirmed?: boolean
}

export interface ConnectedPersonIndex
  extends Required<Pick<Person, '_id' | 'firstName' | 'lastName' | 'cnp'>> {
  documents: IdDocument['documentNumber'][]
}

export interface ConnectedCompanyIndex
  extends Required<Pick<Company, '_id' | 'name' | 'cui' | 'registrationNumber'>> {}

export interface ConnectedPropertyIndex extends Required<Pick<Property, '_id' | 'type'>> {
  vehicleInfo?: Pick<VehicleInfo, 'vin' | 'maker' | 'model' | 'color'> & {
    plateNumbers: string[]
  }
}
