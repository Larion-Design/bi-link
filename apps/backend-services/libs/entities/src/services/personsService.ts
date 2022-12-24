import { Model, ProjectionFields } from 'mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'
import { FileDocument, FileModel } from '@app/entities/models/fileModel'
import { Person } from 'defs'

@Injectable()
export class PersonsService {
  private readonly logger = new Logger(PersonsService.name)

  constructor(
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>,
  ) {}

  create = async (personModel: PersonModel) => {
    try {
      return this.personModel.create(personModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  update = async (personId: string, personModel: PersonModel) =>
    this.personModel.findByIdAndUpdate(personId, personModel)

  find = async (personId: string): Promise<PersonDocument> => {
    try {
      return this.personModel
        .findById(personId)
        .populate({ path: 'files', model: this.fileModel })
        .populate({ path: 'image', model: this.fileModel })
        .populate({ path: 'relationships.person', model: this.personModel })
        .exec()
    } catch (error) {
      this.logger.error(error)
    }
  }

  findMultiplePersonsWithImage = async (
    personsIds: Array<Person['_id']>,
  ): Promise<PersonDocument[]> => {
    try {
      return await this.personModel
        .find(
          { _id: personsIds },
          {
            _id: 1,
            firstName: 1,
            lastName: 1,
            cnp: 1,
            image: 1,
          },
        )
        .populate({ path: 'image', model: this.fileModel })
        .exec()
    } catch (error) {
      this.logger.error(error)
    }
  }

  findPersonsModelsByIds = async (personsIds: Array<Person['_id']>): Promise<PersonDocument[]> => {
    try {
      return this.personModel
        .find(
          { _id: personsIds },
          {
            _id: 1,
            firstName: 1,
            lastName: 1,
            cnp: 1,
          },
        )
        .exec()
    } catch (error) {
      this.logger.error(error)
    }
  }

  async *getPersons(fields: ProjectionFields<PersonDocument> = { _id: 1 }) {
    for await (const personModel of this.personModel.find({}, fields)) {
      yield personModel
    }
  }
}
