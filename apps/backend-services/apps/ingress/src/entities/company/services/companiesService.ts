import { Model, ProjectionFields, Query } from 'mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Company } from 'defs'
import { FileDocument, FileModel } from '../../file/models/fileModel'
import { LocationDocument, LocationModel } from '../../location/models/locationModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import { CompanyDocument, CompanyModel } from '../models/companyModel'

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name)

  constructor(
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(LocationModel.name) private readonly locationModel: Model<LocationDocument>,
  ) {}

  create = async (companyModel: CompanyModel) => {
    try {
      return this.companyModel.create(companyModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  update = async (companyId: string, companyModel: CompanyModel) => {
    try {
      return this.companyModel.findByIdAndUpdate(companyId, companyModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getCompany = async (companyId: string, fetchLinkedEntities: boolean) => {
    try {
      const query = this.companyModel.findById(companyId)
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    } catch (error) {
      this.logger.error(error)
    }
  }

  getCompanies = async (companiesIds: string[], fetchLinkedEntities: boolean) => {
    try {
      if (companiesIds.length) {
        const query = this.companyModel.find({ _id: companiesIds })
        return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
      }
      return []
    } catch (error) {
      this.logger.error(error)
    }
  }

  async *getAllCompanies(fields: ProjectionFields<CompanyDocument> = { _id: 1 }) {
    for await (const companyModel of this.companyModel.find({}, fields)) {
      yield companyModel
    }
  }

  private getLinkedEntities = (query: Query<any, CompanyDocument>) =>
    query
      .populate({ path: 'files' as keyof Company, model: this.fileModel })
      .populate({ path: 'locations' as keyof Company, model: this.locationModel })
      .populate({ path: 'associates.person', model: this.personModel })
      .populate({ path: 'associates.company', model: this.companyModel })
}
