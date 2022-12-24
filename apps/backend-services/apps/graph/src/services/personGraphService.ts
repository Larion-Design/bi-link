import { Injectable, Logger } from '@nestjs/common'
import { GraphService } from '@app/graph-module/graphService'
import { PersonsService } from '@app/entities/services/personsService'
import { EntityLabel, PersonGraphNode, RelationshipLabel } from 'defs'
import { PersonDocument } from '@app/entities/models/personModel'
import { PersonalRelationshipGraph } from '@app/graph-module/types/relationship'

@Injectable()
export class PersonGraphService {
  private readonly logger = new Logger(PersonGraphService.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly graphService: GraphService,
  ) {}

  upsertPersonNode = async (personId: string) => {
    try {
      const personDocument = await this.personsService.find(personId)

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
}
