import { Injectable, Logger } from '@nestjs/common'
import { ClientSession, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { RelationshipDocument, RelationshipModel } from '@app/entities/models/relationshipModel'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'
import { RelationshipInput } from '../dto/relationshipInput'

@Injectable()
export class RelationshipsService {
  private readonly logger = new Logger(RelationshipsService.name)

  constructor(
    @InjectModel(RelationshipModel.name)
    private readonly relationshipModel: Model<RelationshipDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
  ) {}

  getRelationshipsModelsFromInputData = async (relationships: RelationshipInput[]) => {
    const personsModels = await this.personModel.find({
      _id: relationships.map(({ person: { _id } }) => _id),
    })

    return personsModels.map((person) => {
      const relationship = relationships.find(({ person: { _id } }) => _id === String(person._id))
      const relationshipModel = new RelationshipModel()
      relationshipModel.proximity = relationship.proximity
      relationshipModel.type = relationship.type
      relationshipModel.person = person
      return relationshipModel
    })
  }

  addRelationshipToConnectedPersons = async (
    person: PersonDocument,
    personsRelations: RelationshipInput[],
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
    relationshipInfo: RelationshipInput,
    session?: ClientSession,
  ) => {
    const relationship = new RelationshipModel()
    relationship.person = relatingPerson
    relationship.proximity = relationshipInfo.proximity
    relationship.type = relationshipInfo.type

    const relationships = [
      relationship,
      ...relatedPerson.relationships.filter((relationship) => {
        return relationship.person.toString() !== String(relatingPerson._id)
      }),
    ]

    await this.personModel.updateOne(
      { _id: relatedPerson._id as string },
      { $set: { relationships } },
      { session },
    )
  }
}
