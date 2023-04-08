import { Injectable, Logger } from '@nestjs/common'
import { Event } from 'defs'
import { formatDateTime } from 'tools'
import { EventGraphNode } from '@app/definitions/graph/event'
import { PartyGraphRelationship } from '@app/definitions/graph/party'
import { GraphService } from './graphService'
import { LocationGraphService } from './locationGraphService'

@Injectable()
export class EventGraphService {
  private readonly logger = new Logger(EventGraphService.name)

  constructor(
    private readonly graphService: GraphService,
    private readonly locationGraphService: LocationGraphService,
  ) {}

  upsertEventNode = async (eventId: string, eventDocument: Event) => {
    try {
      await this.graphService.upsertEntity<EventGraphNode>(
        {
          _id: eventId,
          date: eventDocument.date.value ? formatDateTime(eventDocument.date.value) : undefined,
        },
        'EVENT',
      )

      await this.upsertEventParties(eventDocument)
      await this.upsertEventLocation(eventDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertEventLocation = async ({ _id, location }: Event) => {
    if (location) {
      await this.locationGraphService.upsertLocationNode(location)
      await this.locationGraphService.upsertLocationRelationship(
        location.locationId,
        String(_id),
        'OCCURED_AT',
      )
    }
  }

  private upsertEventParties = async (eventDocument: Event) => {
    try {
      if (eventDocument.parties.length) {
        const map = new Map<string, PartyGraphRelationship>()

        eventDocument.parties.forEach(
          ({
            metadata: {
              confirmed,
              trustworthiness: { level },
            },
            type,
            companies,
            persons,
            properties,
          }) => {
            const data: PartyGraphRelationship = {
              type,
              _confirmed: confirmed,
              _trustworthiness: level,
            }

            persons.forEach(({ _id }) => map.set(String(_id), data))
            companies.forEach(({ _id }) => map.set(String(_id), data))
            properties.forEach(({ _id }) => map.set(String(_id), data))
          },
        )

        if (map.size) {
          return this.graphService.replaceRelationships(
            String(eventDocument._id),
            map,
            'PARTY_INVOLVED',
          )
        }
      }
    } catch (e) {
      this.logger.error(e)
    }
  }
}
