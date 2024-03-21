import { Model, Query } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PersonDocument, PersonModel } from '../models/personModel'
import { FileDocument, FileModel } from '../../file/models/fileModel'
import { LocationModel, LocationDocument } from '../../location/models/locationModel'

@Injectable()
export class PersonsService {
  constructor(
    @InjectModel(PersonModel.name)
    private readonly personModel: Model<PersonDocument>,
    @InjectModel(FileModel.name)
    private readonly fileModel: Model<FileDocument>,
    @InjectModel(LocationModel.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async create(personModel: PersonModel) {
    return this.personModel.create(personModel)
  }

  async update(personId: string, personModel: PersonModel) {
    return this.personModel.findByIdAndUpdate(personId, personModel)
  }

  async find(personId: string, fetchLinkedEntities: boolean): Promise<PersonDocument | never> {
    const query = this.personModel.findById(personId)
    return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
  }

  findByNameAndBirthdate = async (firstName: string, lastName: string, birthdate: Date) => {
    return this.personModel
      .findOne(
        {
          $and: [
            { 'firstName.value': firstName },
            { 'lastName.value': lastName },
            { 'birthdate.value': birthdate },
          ],
        },
        { _id: 1 },
      )
      .exec()
  }

  findByCNP = async (cnp: string) => {
    return this.personModel.findOne({ 'cnp.value': cnp }, { _id: 1 }).exec()
  }

  findByMetadataSourceUrl = async (dataSource: string) => {
    return await this.personModel
      .findOne({ 'metadata.trustworthiness.source': dataSource }, { _id: 1 })
      .exec()
  }

  findByDocumentNumber = async (documentNumber: string) => {
    return this.personModel
      .findOne({ 'documents.documentNumber': documentNumber }, { _id: 1 })
      .exec()
  }

  async getPersons(
    personsIds: string[],
    fetchLinkedEntities: boolean,
  ): Promise<PersonDocument[] | never> {
    if (personsIds.length) {
      const query = this.personModel.find({ _id: personsIds })
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    }
    return []
  }

  async getAllPersons(): Promise<PersonDocument[]> | never {
    const query = this.personModel.find()
    return await this.getLinkedEntities(query).exec()
  }

  private getLinkedEntities = (query: Query<any, PersonDocument>) =>
    query
      .populate({ path: 'files', model: this.fileModel })
      .populate({ path: 'images', model: this.fileModel })
      .populate({ path: 'relationships.person', model: this.personModel })
      .populate({ path: 'birthPlace', model: this.locationModel })
      .populate({ path: 'homeAddress', model: this.locationModel })
}
