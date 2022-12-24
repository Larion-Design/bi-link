import { EntityMetadata, Incident } from 'defs'

export interface IncidentGraphNode extends EntityMetadata, Pick<Incident, 'location'> {
  date: string
}
