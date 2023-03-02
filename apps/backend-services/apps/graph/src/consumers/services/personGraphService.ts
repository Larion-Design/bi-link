import { PersonGraphNode } from '@app/definitions/graph'
import { LocationDocument } from '@app/models/models/locationModel'
import { PersonDocument } from '@app/models/models/person/personModel'
import { PersonsService } from '@app/models/services/personsService'
import { GraphService } from '@app/graph-module/graphService'
import { PersonalRelationshipGraph } from '@app/definitions/graph/relationship'
import { Injectable, Logger } from '@nestjs/common'
import { EntityLabel, RelationshipLabel } from 'defs'
import { LocationGraphService } from './locationGraphService'

@Injectable()
export class PersonGraphService {
  private readonly logger = new Logger(PersonGraphService.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly graphService: GraphService,
    private readonly locationGraphservice: LocationGraphService,
  ) {}

  upsertPersonNode = async (personId: string) => {
    try {
      const personDocument = await this.personsService.find(personId, true)

      await this.graphService.upsertEntity<PersonGraphNode>(
        {
          _id: personId,
          firstName: personDocument.firstName,
          lastName: personDocument.lastName,
          cnp: personDocument.cnp,
          documents: personDocument.documents.map(({ documentNumber }) => documentNumber),
        },
        EntityLabel.PERSON,
      )

      await this.upsertPersonRelationships(personDocument)
      await this.upsertPersonLocations(personDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertPersonRelationships = async (personDocument: PersonDocument) => {
    try {
      const map = new Map<string, PersonalRelationshipGraph>()

      personDocument.relationships.forEach(({ person: { _id }, type, proximity, _confirmed }) =>
        map.set(String(_id), {
          type,
          proximity,
          _confirmed,
        }),
      )

      if (map.size) {
        await this.graphService.replaceRelationships(
          String(personDocument._id),
          map,
          RelationshipLabel.RELATED,
        )
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertPersonLocations = async (personDocument: PersonDocument) => {
    try {
      const locations: LocationDocument[] = []

      if (personDocument.homeAddress) {
        locations.push(personDocument.homeAddress)
      }
      if (personDocument.birthPlace) {
        locations.push(personDocument.birthPlace)
      }

      if (locations.length) {
        await this.locationGraphservice.upsertLocationNodes(locations)

        const personId = String(personDocument._id)

        if (personDocument.homeAddress) {
          await this.locationGraphservice.upsertLocationRelationship(
            personDocument.homeAddress.locationId,
            personId,
            RelationshipLabel.LIVES_AT,
          )
        }

        if (personDocument.birthPlace) {
          await this.locationGraphservice.upsertLocationRelationship(
            personDocument.birthPlace.locationId,
            personId,
            RelationshipLabel.BORN_IN,
          )
        }
      }
    } catch (e) {
      this.logger.error(e)
    }
  }
}
