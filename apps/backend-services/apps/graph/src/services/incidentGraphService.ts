import { Injectable, Logger } from '@nestjs/common'
import { GraphService } from '@app/graph-module/graphService'
import { IncidentsService } from '@app/entities/services/incidentsService'
import { IncidentGraphNode } from '@app/graph-module/types/incident'
import { EntityLabel, RelationshipLabel } from 'defs'
import { IncidentDocument } from '@app/entities/models/incidentModel'
import { PartyGraphRelationship } from '@app/graph-module/types/party'
import { format } from 'date-fns'

@Injectable()
export class IncidentGraphService {
  private readonly logger = new Logger(IncidentGraphService.name)

  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly graphService: GraphService,
  ) {}

  upsertIncidentNode = async (incidentId: string) => {
    try {
      const incidentDocument = await this.incidentsService.getIncident(incidentId)

      await this.graphService.upsertEntity<IncidentGraphNode>(
        {
          _id: incidentId,
          date: format(incidentDocument.date, 'yyyy-MM-dd HH:mm:ss'),
          location: incidentDocument.location,
        },
        EntityLabel.INCIDENT,
      )

      await this.upsertPartyRelationships(incidentDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertPartyRelationships = async (incidentDocument: IncidentDocument) => {
    try {
      if (incidentDocument.parties.length) {
        const map = new Map<string, PartyGraphRelationship>()

        incidentDocument.parties.forEach(({ name, _confirmed, companies, persons, properties }) => {
          const data: PartyGraphRelationship = { name, _confirmed }
          persons.forEach(({ _id }) => map.set(String(_id), data))
          companies.forEach(({ _id }) => map.set(String(_id), data))
          properties.forEach(({ _id }) => map.set(String(_id), data))
        })

        if (map.size) {
          return this.graphService.replaceRelationships(
            String(incidentDocument._id),
            map,
            RelationshipLabel.PARTY_INVOLVED,
          )
        }
      }
    } catch (e) {
      this.logger.error(e)
    }
  }
}
