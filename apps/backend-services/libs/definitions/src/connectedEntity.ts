import { Person } from '@app/definitions/person'
import { IdDocument } from '@app/definitions/idDocument'
import { Company } from '@app/definitions/company'
import { Property, VehicleInfo } from '@app/definitions/property'

export interface ConnectedEntity {
  _id: Person['_id'] | Company['_id'] | Property['_id']
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
