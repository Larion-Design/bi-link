import { Injectable } from '@nestjs/common'
import { Location, Person } from 'defs'
import { PersonalRelationshipGraph, PersonGraphNode } from '@modules/definitions'
import { GraphService } from './graphService'
import { LocationGraphService } from './locationGraphService'

@Injectable()
export class PersonGraphService {
  constructor(
    private readonly graphService: GraphService,
    private readonly locationGraphService: LocationGraphService,
  ) {}

  async upsertPersonsNodes(personsDocuments: Person[]) {
    await this.graphService.upsertEntities<PersonGraphNode>(
      personsDocuments.map((personDocument) => ({
        _id: String(personDocument._id),
        firstName: personDocument.firstName.value,
        lastName: personDocument.lastName.value,
        cnp: personDocument.cnp.value,
        documents: personDocument.documents.map(({ documentNumber }) => documentNumber),
        _confirmed: personDocument.metadata?.confirmed ?? true,
        _trustworthiness: personDocument.metadata?.trustworthiness.level ?? 0,
      })),
      'PERSON',
    )

    for await (const personDocument of personsDocuments) {
      console.debug('Regenerating relationships for person', personDocument._id)
      await this.upsertPersonRelationships(personDocument)

      console.debug('Regenerating locations for person', personDocument._id)
      await this.upsertPersonLocations(personDocument)
    }
  }

  async upsertPersonNode(personId: string, personDocument: Person) {
    await this.graphService.upsertEntity<PersonGraphNode>(
      {
        _id: String(personId),
        firstName: personDocument.firstName.value,
        lastName: personDocument.lastName.value,
        cnp: personDocument.cnp.value,
        documents: personDocument.documents.map(({ documentNumber }) => documentNumber),
        _confirmed: personDocument.metadata?.confirmed ?? true,
        _trustworthiness: personDocument.metadata?.trustworthiness.level ?? 0,
      },
      'PERSON',
    )

    await Promise.all([
      this.upsertPersonRelationships(personDocument),
      this.upsertPersonLocations(personDocument),
    ])
  }

  async upsertPersonRelationships(personDocument: Person) {
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
  }

  async upsertPersonLocations({ _id, birthPlace, homeAddress }: Person) {
    const locations: Location[] = []

    if (homeAddress) {
      locations.push(homeAddress)
    }
    if (birthPlace) {
      locations.push(birthPlace)
    }

    if (locations.length) {
      await this.locationGraphService.upsertLocationNodes(locations)

      const personId = String(_id)
      const promises: Promise<unknown>[] = []

      if (homeAddress) {
        promises.push(
          this.locationGraphService.upsertLocationRelationship(
            homeAddress.locationId,
            personId,
            'LIVES_AT',
          ),
        )
      }

      if (birthPlace) {
        promises.push(
          this.locationGraphService.upsertLocationRelationship(
            birthPlace.locationId,
            personId,
            'BORN_IN',
          ),
        )
      }

      if (promises.length) {
        await Promise.all(promises)
      }
    }
  }
}
