import { LocationDocument, LocationModel } from '@app/entities/models/locationModel'
import { Model, ProjectionFields, Query } from 'mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PersonDocument, PersonModel } from '@app/entities/models/person/personModel'
import { FileDocument, FileModel } from '@app/entities/models/fileModel'

@Injectable()
export class PersonsService {
  private readonly logger = new Logger(PersonsService.name)

  constructor(
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>,
    @InjectModel(LocationModel.name) private readonly locationModel: Model<LocationDocument>,
  ) {}

  create = async (personModel: PersonModel) => {
    try {
      return this.personModel.create(personModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  update = async (personId: string, personModel: PersonModel) => {
    try {
      return this.personModel.findByIdAndUpdate(personId, personModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  find = async (personId: string, fetchLinkedEntities: boolean): Promise<PersonDocument> => {
    try {
      const query = this.personModel.findById(personId)
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    } catch (error) {
      this.logger.error(error)
    }
  }

  getPersons = async (
    personsIds: string[],
    fetchLinkedEntities: boolean,
  ): Promise<PersonDocument[]> => {
    try {
      const query = this.personModel.find({ _id: personsIds })
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    } catch (error) {
      this.logger.error(error)
    }
  }

  async *getAllPersons(fields: ProjectionFields<PersonDocument> = { _id: 1 }) {
    for await (const personModel of this.personModel.find({}, fields)) {
      yield personModel
    }
  }

  private getLinkedEntities = (query: Query<any, PersonDocument>) =>
    query
      .populate({ path: 'files', model: this.fileModel })
      .populate({ path: 'images', model: this.fileModel })
      .populate({ path: 'relationships.person', model: this.personModel })
      .populate({ path: 'birthPlace', model: this.locationModel })
      .populate({ path: 'homeAddress', model: this.locationModel })
}
