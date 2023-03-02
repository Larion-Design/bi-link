import { EventDocument } from '@app/models/models/event/eventModel'
import { EventsService } from '@app/models/services/eventsService'
import { GraphService } from '@app/graph-module/graphService'
import { EventGraphNode } from '@app/definitions/graph/event'
import { PartyGraphRelationship } from '@app/definitions/graph/party'
import { Injectable, Logger } from '@nestjs/common'
import { format } from 'date-fns'
import { EntityLabel, RelationshipLabel } from 'defs'
import { LocationGraphService } from './locationGraphService'

@Injectable()
export class EventGraphService {
  private readonly logger = new Logger(EventGraphService.name)

  constructor(
    private readonly eventsService: EventsService,
    private readonly graphService: GraphService,
    private readonly locationGraphservice: LocationGraphService,
  ) {}

  upsertEventNode = async (eventId: string) => {
    try {
      const eventDocument = await this.eventsService.getEvent(eventId, true)

      await this.graphService.upsertEntity<EventGraphNode>(
        {
          _id: eventId,
          date: format(eventDocument.date, 'yyyy-MM-dd HH:mm:ss'),
        },
        EntityLabel.EVENT,
      )

      await this.upsertEventParties(eventDocument)
      await this.upsertEventLocation(eventDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertEventLocation = async ({ _id, location }: EventDocument) => {
    if (location) {
      await this.locationGraphservice.upsertLocationNode(location)
      await this.locationGraphservice.upsertLocationRelationship(
        location.locationId,
        String(_id),
        RelationshipLabel.OCCURED_AT,
      )
    }
  }

  private upsertEventParties = async (eventDocument: EventDocument) => {
    try {
      if (eventDocument.parties.length) {
        const map = new Map<string, PartyGraphRelationship>()

        eventDocument.parties.forEach(({ name, _confirmed, companies, persons, properties }) => {
          const data: PartyGraphRelationship = { name, _confirmed }
          persons.forEach(({ _id }) => map.set(String(_id), data))
          companies.forEach(({ _id }) => map.set(String(_id), data))
          properties.forEach(({ _id }) => map.set(String(_id), data))
        })

        if (map.size) {
          return this.graphService.replaceRelationships(
            String(eventDocument._id),
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
