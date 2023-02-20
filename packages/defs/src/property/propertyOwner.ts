import { Person } from '../person'
import { Company } from '../company'
import { CustomField } from '../customField'
import { ConnectedEntity } from '../connectedEntity'
import { NodesRelationship } from '../entitiesGraph'

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
  plateNumbers: string[]
}

export interface PropertyOwnerAPI extends Omit<PropertyOwner, 'person' | 'company'> {
  person?: ConnectedEntity
  company?: ConnectedEntity
}

export interface PropertyOwnerRelationship
  extends NodesRelationship,
    Pick<PropertyOwner, 'startDate' | 'endDate'> {}
