import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CompanyDocument, CompanyModel } from '@app/entities/models/companyModel'
import { Model, ProjectionFields } from 'mongoose'
import { FileDocument, FileModel } from '@app/entities/models/fileModel'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'
import { PropertyOwnerDocument, PropertyOwnerModel } from '@app/entities/models/propertyOwnerModel'
import { PropertyDocument, PropertyModel } from '@app/entities/models/propertyModel'

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name)

  constructor(
    @InjectModel(PropertyModel.name) private readonly propertyModel: Model<PropertyDocument>,
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(PropertyOwnerModel.name)
    private readonly propertyOwnerModel: Model<PropertyOwnerDocument>,
  ) {}

  create = async (propertyModel: PropertyModel) => {
    try {
      return this.propertyModel.create(propertyModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  update = async (propertyId: string, propertyModel: PropertyModel) => {
    try {
      return this.propertyModel.findByIdAndUpdate(propertyId, propertyModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getProperty = async (propertyId: string) => {
    try {
      return this.propertyModel
        .findById(propertyId)
        .populate({ path: 'files', model: this.fileModel })
        .populate({ path: 'images', model: this.fileModel })
        .populate({ path: 'owners.person', model: this.personModel })
        .populate({ path: 'owners.company', model: this.companyModel })
        .exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  getProperties = async (propertiesIds: string[]) => {
    try {
      return this.propertyModel
        .find({ _id: propertiesIds })
        .populate({ path: 'files', model: this.fileModel })
        .populate({ path: 'images', model: this.fileModel })
        .populate({ path: 'owners.person', model: this.personModel })
        .populate({ path: 'owners.company', model: this.companyModel })
        .exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  async *getAllProperties(fields: ProjectionFields<PropertyDocument> = { _id: 1 }) {
    for await (const propertyModel of this.propertyModel.find({}, fields)) {
      yield propertyModel
    }
  }
}
