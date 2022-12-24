import { Person } from './person'
import { Company } from './company'
import { Property, VehicleInfo } from './property'
import { IdDocument } from './idDocument'
import { Incident } from './incident'

export interface ConnectedEntity
  extends NonNullable<Pick<Person | Company | Property | Incident, '_id'>> {
  _confirmed?: boolean
}

export interface ConnectedPersonIndex
  extends NonNullable<Required<Pick<Person, '_id' | 'firstName' | 'lastName' | 'cnp'>>> {
  documents: IdDocument['documentNumber'][]
}

export interface ConnectedCompanyIndex
  extends NonNullable<Pick<Company, '_id' | 'name' | 'cui' | 'registrationNumber'>> {}

export interface ConnectedPropertyIndex
  extends NonNullable<Required<Pick<Property, '_id' | 'type'>>> {
  vehicleInfo?: Pick<VehicleInfo, 'vin' | 'maker' | 'model' | 'color'> & {
    plateNumbers: string[]
  }
}
