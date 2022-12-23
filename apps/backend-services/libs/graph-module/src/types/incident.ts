import { Incident } from '@app/definitions/incident'
import { EntityMetadata } from '@app/definitions/entitiesGraph'

export interface IncidentGraphNode extends EntityMetadata, Pick<Incident, 'location'> {
  date: string
}
