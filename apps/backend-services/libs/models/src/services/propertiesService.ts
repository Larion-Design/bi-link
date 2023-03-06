import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ProjectionFields, Query } from 'mongoose'
import { LocationDocument, LocationModel } from '@app/models/models/locationModel'
import { CompanyDocument, CompanyModel } from '@app/models/models/company/companyModel'
import { FileDocument, FileModel } from '@app/models/models/fileModel'
import { PersonDocument, PersonModel } from '@app/models/models/person/personModel'
import {
  PropertyOwnerDocument,
  PropertyOwnerModel,
} from '@app/models/models/property/propertyOwnerModel'
import { PropertyDocument, PropertyModel } from '@app/models/models/property/propertyModel'

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name)

  constructor(
    @InjectModel(PropertyModel.name) private readonly propertyModel: Model<PropertyDocument>,
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(LocationModel.name) private readonly locationModel: Model<LocationDocument>,
    @InjectModel(PropertyOwnerModel.name) private readonly ownerModel: Model<PropertyOwnerDocument>,
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

  getProperty = async (propertyId: string, fetchLinkedEntities: boolean) => {
    try {
      const query = this.propertyModel.findById(propertyId)
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  getProperties = async (propertiesIds: string[], fetchLinkedEntities: boolean) => {
    try {
      if (propertiesIds.length) {
        const query = this.propertyModel.find({ _id: propertiesIds })
        return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
      }
      return []
    } catch (e) {
      this.logger.error(e)
    }
  }

  async *getAllProperties(fields: ProjectionFields<PropertyDocument> = { _id: 1 }) {
    for await (const propertyModel of this.propertyModel.find({}, fields)) {
      yield propertyModel
    }
  }

  private getLinkedEntities = (query: Query<any, PropertyDocument>) =>
    query
      .populate({ path: 'files', model: this.fileModel })
      .populate({ path: 'images', model: this.fileModel })
      .populate({ path: 'owners.person', model: this.personModel })
      .populate({ path: 'owners.company', model: this.companyModel })
      .populate({ path: 'realEstateInfo.location', model: this.locationModel })
}