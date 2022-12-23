import { CompanyOwnerIndex, Owner, OwnerAPIInput, OwnerAPIOutput, PersonOwnerIndex } from './owner'
import { CustomField } from './customField'
import { EmbeddedFileIndex } from './file'

export interface Vehicle {
  _id?: string
  vin: string
  maker: string
  model: string
  color: string
  image: File | null
  owners: Owner[]
  customFields: CustomField[]
  files: File[]
}

export interface VehicleAPIOutput extends Omit<Vehicle, 'owners'> {
  owners: OwnerAPIOutput[]
}

export interface VehicleAPIInput extends Readonly<Omit<Vehicle, '_id' | 'owners'>> {
  owners: OwnerAPIInput[]
}

export interface VehicleIndex
  extends Pick<Vehicle, 'vin' | 'maker' | 'model' | 'color' | 'customFields'> {
  plateRegistrationNumbers: Array<Owner['registrationNumber']>
  files: EmbeddedFileIndex[]
  companyOwners: CompanyOwnerIndex[]
  personOwners: PersonOwnerIndex[]
}

export interface VehicleSearchIndex extends Pick<VehicleIndex, 'vin' | 'maker' | 'model'> {}
export interface VehicleListRecord extends VehicleSearchIndex, Pick<Vehicle, '_id'> {}

export type VehiclesSuggestions = {
  total: number
  records: VehicleListRecord[]
}
