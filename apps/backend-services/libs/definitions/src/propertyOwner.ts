import { Person } from '@app/definitions/person'
import { Company } from '@app/definitions/company'
import { CustomField } from '@app/definitions/customField'
import { ConnectedEntity } from '@app/definitions/connectedEntity'
import { NodesRelationship } from '@app/definitions/entitiesGraph'

export interface PropertyOwner {
  person?: Person | null
  company?: Company | null
  startDate: Date | null
  endDate: Date | null
  customFields: CustomField[]
  _confirmed: boolean
  vehicleOwnerInfo: VehicleOwnerInfo | null
}

export interface VehicleOwnerInfo {
  registrationNumber: string
}

export interface PropertyOwnerAPI extends Omit<PropertyOwner, 'person' | 'company'> {
  person?: ConnectedEntity
  company?: ConnectedEntity
}

export interface PropertyOwnerRelationship
  extends NodesRelationship,
    Pick<PropertyOwner, 'startDate' | 'endDate'> {}
