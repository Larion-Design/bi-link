import { Injectable } from '@nestjs/common'
import { RelationshipAPI } from 'defs'
import { ClientSession, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { PersonDocument, PersonModel } from '../models/personModel'
import { RelationshipModel } from '../models/relationshipModel'
import { PersonsService } from './personsService'

@Injectable()
export class RelationshipsAPIService {
  constructor(
    @InjectModel(PersonModel.name)
    private readonly personModel: Model<PersonDocument>,
    private readonly personsService: PersonsService,
  ) {}

  getRelationshipsModelsFromInputData = async (relationships: RelationshipAPI[]) => {
    const relationshipsMap = new Map<string, RelationshipAPI>()
    const personsIds = new Set<string>()

    relationships.forEach((relationshipInfo) => {
      const {
        person: { _id },
        relatedPersons,
      } = relationshipInfo

      personsIds.add(_id)
      relatedPersons.forEach(({ _id }) => personsIds.add(_id))
      relationshipsMap.set(_id, relationshipInfo)
    })

    if (personsIds.size) {
      const personsDocuments = await this.personsService.getPersons(Array.from(personsIds), false)
      const personsDocumentsMap = new Map<string, PersonDocument>()
      personsDocuments.forEach((personDocument) =>
        personsDocumentsMap.set(String(personDocument._id), personDocument),
      )

      return Array.from(relationshipsMap.entries()).map(([personId, relationshipInfo]) => {
        const relationshipModel = this.createRelationshipModel(relationshipInfo)
        relationshipModel.person = personsDocumentsMap.get(personId)!
        relationshipModel.relatedPersons = relationshipInfo.relatedPersons.map(
          ({ _id }) => personsDocumentsMap.get(_id)!,
        )
        return relationshipModel
      })
    }
    return []
  }

  async addRelationshipToConnectedPersons(
    person: PersonDocument,
    personsRelations: RelationshipAPI[],
  ) {
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

  private createRelationshipModel(relationshipInfo: RelationshipAPI) {
    const { proximity, type, description, metadata } = relationshipInfo
    const relationshipModel = new RelationshipModel()
    relationshipModel.metadata = metadata
    relationshipModel.proximity = proximity
    relationshipModel.type = type
    relationshipModel.description = description
    return relationshipModel
  }
}
