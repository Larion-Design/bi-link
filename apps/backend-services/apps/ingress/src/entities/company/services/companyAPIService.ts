import { Injectable, Logger } from '@nestjs/common'
import { CompanyAPIInput } from 'defs'
import { FileAPIService } from '../../file/services/fileAPIService'
import { CustomFieldsService } from '../../cusotmField/services/customFieldsService'
import { LocationAPIService } from '../../location/services/locationAPIService'
import { AssociatesService } from './associatesService'
import { CompaniesService } from './companiesService'
import { CompanyModel } from '../models/companyModel'

@Injectable()
export class CompanyAPIService {
  private readonly logger = new Logger(CompanyAPIService.name)

  constructor(
    private readonly locationAPIService: LocationAPIService,
    private readonly fileService: FileAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly companiesService: CompaniesService,
    private readonly associatesService: AssociatesService,
  ) {}

  create = async (companyInfo: CompanyAPIInput) => {
    try {
      const companyModel = await this.createCompanyDocument(companyInfo)
      const companyDocument = await this.companiesService.create(companyModel)
      return String(companyDocument._id)
    } catch (error) {
      this.logger.error(error)
    }
  }

  update = async (companyId: string, companyInfo: CompanyAPIInput) => {
    try {
      const companyModel = await this.createCompanyDocument(companyInfo)
      await this.companiesService.update(companyId, companyModel)
      return true
    } catch (error) {
      this.logger.error(error)
    }
  }

  private createCompanyDocument = async (companyInfo: CompanyAPIInput) => {
    try {
      const companyModel = new CompanyModel()
      companyModel.name = companyInfo.name
      companyModel.cui = companyInfo.cui
      companyModel.registrationNumber = companyInfo.registrationNumber

      companyModel.headquarters = companyInfo.headquarters
        ? await this.locationAPIService.getLocationModel(companyInfo.headquarters)
        : null

      companyModel.locations = companyInfo.locations.length
        ? await this.locationAPIService.getLocationsModels(companyInfo.locations)
        : []

      companyModel.contactDetails = companyInfo.contactDetails.length
        ? this.customFieldsService.createCustomFieldsModels(companyInfo.contactDetails)
        : []

      companyModel.customFields = companyInfo.customFields.length
        ? this.customFieldsService.createCustomFieldsModels(companyInfo.customFields)
        : []

      companyModel.files = companyInfo.files.length
        ? await this.fileService.getUploadedFilesModels(companyInfo.files)
        : []

      companyModel.associates = companyInfo.associates.length
        ? await this.associatesService.createAssociatesModels(companyInfo.associates)
        : []

      return companyModel
    } catch (e) {
      this.logger.error(e)
    }
  }
}
