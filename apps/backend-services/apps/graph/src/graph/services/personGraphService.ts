import { Injectable, Logger } from '@nestjs/common'
import { Location, Person } from 'defs'
import { PersonGraphNode } from '@app/definitions/graph'
import { GraphService } from '@app/graph-module/graphService'
import { PersonalRelationshipGraph } from '@app/definitions/graph/relationship'
import { LocationGraphService } from './locationGraphService'

@Injectable()
export class PersonGraphService {
  private readonly logger = new Logger(PersonGraphService.name)

  constructor(
    private readonly graphService: GraphService,
    private readonly locationGraphservice: LocationGraphService,
  ) {}

  upsertPersonNode = async (personId: string, personDocument: Person) => {
    try {
      await this.graphService.upsertEntity<PersonGraphNode>(
        {
          _id: personId,
          firstName: personDocument.firstName.value,
          lastName: personDocument.lastName.value,
          cnp: personDocument.cnp.value,
          documents: personDocument.documents.map(({ documentNumber }) => documentNumber),
          _confirmed: personDocument.metadata.confirmed,
          _trustworthiness: personDocument.metadata.trustworthiness.level,
        },
        'PERSON',
      )

      await this.upsertPersonRelationships(personDocument)
      await this.upsertPersonLocations(personDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertPersonRelationships = async (personDocument: Person) => {
    try {
      const map = new Map<string, PersonalRelationshipGraph>()

      personDocument.relationships.forEach(
        ({
          person: { _id },
          type,
          proximity,
          metadata: {
            confirmed,
            trustworthiness: { level },
          },
        }) =>
          map.set(String(_id), {
            type,
            proximity,
            _confirmed: confirmed,
            _trustworthiness: level,
          }),
      )

      if (map.size) {
        await this.graphService.replaceRelationships(String(personDocument._id), map, 'RELATED')
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertPersonLocations = async ({ _id, birthPlace, homeAddress }: Person) => {
    try {
      const locations: Location[] = []

      if (homeAddress) {
        locations.push(homeAddress)
      }
      if (birthPlace) {
        locations.push(birthPlace)
      }

      if (locations.length) {
        await this.locationGraphservice.upsertLocationNodes(locations)

        const personId = String(_id)

        if (homeAddress) {
          await this.locationGraphservice.upsertLocationRelationship(
            homeAddress.locationId,
            personId,
            'LIVES_AT',
          )
        }

        if (birthPlace) {
          await this.locationGraphservice.upsertLocationRelationship(
            birthPlace.locationId,
            personId,
            'BORN_IN',
          )
        }
      }
    } catch (e) {
      this.logger.error(e)
    }
  }
}
