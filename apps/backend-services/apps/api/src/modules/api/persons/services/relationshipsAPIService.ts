import { Injectable, Logger } from '@nestjs/common'
import { RelationshipAPI } from 'defs'
import { ClientSession, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import {
  RelationshipDocument,
  RelationshipModel,
} from '@app/models/person/models/relationshipModel'
import { PersonDocument, PersonModel } from '@app/models/person/models/personModel'
import { PersonsService } from '@app/models/person/services/personsService'

@Injectable()
export class RelationshipsAPIService {
  private readonly logger = new Logger(RelationshipsAPIService.name)

  constructor(
    @InjectModel(RelationshipModel.name)
    private readonly relationshipModel: Model<RelationshipDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    private readonly personsService: PersonsService,
  ) {}

  getRelationshipsModelsFromInputData = async (relationships: RelationshipAPI[]) => {
    const personsModels = await this.personsService.getPersons(
      Array.from(
        new Set(
          [].concat(
            ...relationships.map(({ person: { _id: personId }, relatedPersons }) => [
              ...relatedPersons.map(({ _id }) => _id),
              personId,
            ]),
          ),
        ),
      ),
      false,
    )

    return relationships.map(
      ({ person: { _id }, relatedPersons, proximity, type, description }) => {
        const personModel = personsModels.find(({ _id: personId }) => _id === String(personId))

        const relationshipModel = new RelationshipModel()
        relationshipModel.proximity = proximity
        relationshipModel.type = type
        relationshipModel.person = personModel
        relationshipModel.description = description
        relationshipModel.relatedPersons = relatedPersons.map(({ _id }) =>
          personsModels.find(({ _id: personId }) => String(personId) === _id),
        )
        return relationshipModel
      },
    )
  }

  addRelationshipToConnectedPersons = async (
    person: PersonDocument,
    personsRelations: RelationshipAPI[],
  ) => {
    try {
      const session = await this.personModel.startSession()

      const relatedPersons = await this.personModel
        .find({ _id: personsRelations.map(({ person: { _id } }) => _id) }, null, { session })
        .exec()

      if (relatedPersons?.length) {
        await Promise.all(
          relatedPersons.map(async (relatedPerson) => {
            const relationship = personsRelations.find(
              ({ person: { _id } }) => _id === String(relatedPerson._id),
            )

            if (relationship) {
              return this.upsertRelationship(person, relatedPerson, relationship, session)
            }
          }),
        )
      }
      return await session.endSession()
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertRelationship = async (
    relatingPerson: PersonDocument,
    relatedPerson: PersonDocument,
    relationshipInfo: RelationshipAPI,
    session?: ClientSession,
  ) => {
    const relationship = new RelationshipModel()
    relationship.person = relatingPerson
    relationship.proximity = relationshipInfo.proximity
    relationship.type = relationshipInfo.type
    relationship.description = relationshipInfo.description

    const relationships = [
      relationship,
      ...relatedPerson.relationships.filter((relationship) => {
        return relationship.person.toString() !== String(relatingPerson._id)
      }),
    ]

    await this.personModel.updateOne(
      { _id: relatedPerson._id },
      { $set: { relationships } },
      { session },
    )
  }
}
