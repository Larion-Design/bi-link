import { LocationIndex } from '@app/definitions/search/location'
import { Company, IdDocument, Person, Property, RealEstateInfo, VehicleInfo } from 'defs'

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
  realEstateInfo?: Pick<RealEstateInfo, 'surface' | 'townArea'> & {
    location: LocationIndex
  }
}
