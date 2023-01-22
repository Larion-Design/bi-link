import { Model, ProjectionFields } from 'mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CompanyDocument, CompanyModel } from '@app/entities/models/companyModel'
import { AssociateDocument, AssociateModel } from '@app/entities/models/associateModel'
import { FileDocument, FileModel } from '@app/entities/models/fileModel'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name)

  constructor(
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(AssociateModel.name) private readonly associateModel: Model<AssociateDocument>,
  ) {}

  create = async (companyModel: CompanyModel) => this.companyModel.create(companyModel)

  update = async (companyId: string, companyModel: CompanyModel) =>
    this.companyModel.findByIdAndUpdate(companyId, companyModel)

  getCompany = async (companyId: string) => {
    try {
      return this.companyModel
        .findById(companyId)
        .populate({ path: 'files', model: this.fileModel })
        .populate({ path: 'associates', model: this.associateModel })
        .populate({ path: 'associates.person', model: this.personModel })
        .populate({ path: 'associates.company', model: this.companyModel })
        .exec()
    } catch (error) {
      this.logger.error(error)
    }
  }

  getCompanies = async (companiesIds: string[]) => {
    try {
      return this.companyModel
        .find({ _id: companiesIds })
        .populate({ path: 'files', model: this.fileModel })
        .populate({ path: 'associates', model: this.associateModel })
        .populate({ path: 'associates.person', model: this.personModel })
        .populate({ path: 'associates.company', model: this.companyModel })
        .exec()
    } catch (error) {
      this.logger.error(error)
    }
  }

  getCompaniesDocuments = async (companiesIds: string[]) => {
    try {
      return this.companyModel.find({ _id: companiesIds }).exec()
    } catch (error) {
      this.logger.error(error)
    }
  }

  async *getAllCompanies(fields: ProjectionFields<CompanyDocument> = { _id: 1 }) {
    for await (const companyModel of this.companyModel.find({}, fields)) {
      yield companyModel
    }
  }
}
