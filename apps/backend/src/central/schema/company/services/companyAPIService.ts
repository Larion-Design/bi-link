import { Injectable } from '@nestjs/common'
import { CompanyRelationshipsService } from '@modules/central/schema/company/services/company-relationships.service'
import { EntityEventDispatcherService } from '@modules/entity-events'
import { CompanyAPIInput, UpdateSource } from 'defs'
import { FileAPIService } from '../../file/services/fileAPIService'
import { CustomFieldsService } from '../../customField/services/customFieldsService'
import { LocationAPIService } from '../../location/services/locationAPIService'
import { AssociatesService } from './associatesService'
import { CompaniesService } from './companiesService'
import { CompanyModel } from '../models/companyModel'
import { CompanyHistorySnapshotService } from './companyHistorySnapshotService'
import { CompanyPendingSnapshotService } from './companyPendingSnapshotService'

@Injectable()
export class CompanyAPIService {
  constructor(
    private readonly entityEventDispatcherService: EntityEventDispatcherService,
    private readonly locationAPIService: LocationAPIService,
    private readonly fileService: FileAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly companiesService: CompaniesService,
    private readonly associatesService: AssociatesService,
    private readonly companyRelationshipsService: CompanyRelationshipsService,
    private readonly companyPendingSnapshotService: CompanyPendingSnapshotService,
    private readonly companyHistorySnapshotService: CompanyHistorySnapshotService,
  ) {}

  async create(companyInfo: CompanyAPIInput) {
    const companyModel = await this.createCompanyDocument(companyInfo)

    if (companyModel) {
      const companyDocument = await this.companiesService.create(companyModel)

      if (companyDocument) {
        await this.entityEventDispatcherService.companyCreated(companyDocument)
        return String(companyDocument._id)
      }
    }
  }

  async update(companyId: string, companyInfo: CompanyAPIInput) {
    const companyModel = await this.createCompanyDocument(companyInfo, companyId)

    if (companyModel) {
      const updatedCompany = await this.companiesService.update(companyId, companyModel)

      if (updatedCompany) {
        const companyDocument = await this.companiesService.getCompany(updatedCompany._id, true)
        await this.entityEventDispatcherService.companyUpdated(companyDocument)
        return true
      }
    }
  }

  createPendingSnapshot = async (entityId: string, data: CompanyAPIInput, source: UpdateSource) => {
    const model = await this.createCompanyDocument(data)

    if (model) {
      const snapshotModel = await this.companyPendingSnapshotService.create(entityId, model, source)

      if (snapshotModel) {
        return String(snapshotModel._id)
      }
    }
  }

  createHistorySnapshot = async (entityId: string, data: CompanyAPIInput, source: UpdateSource) => {
    const model = await this.createCompanyDocument(data)

    if (model) {
      return this.companyHistorySnapshotService.create(entityId, model, source)
    }
  }

  private async createCompanyDocument(companyInfo: CompanyAPIInput, companyId?: string) {
    const companyModel = new CompanyModel()

    if (companyId) {
      companyModel._id = companyId
    }

    companyModel.metadata = companyInfo.metadata
    companyModel.name = companyInfo.name
    companyModel.cui = companyInfo.cui
    companyModel.registrationNumber = companyInfo.registrationNumber
    companyModel.registrationDate = companyInfo.registrationDate
    companyModel.active = companyInfo.active
    companyModel.balanceSheets = []
    companyModel.activityCodes = []
    companyModel.status = companyInfo.status

    companyModel.headquarters = companyInfo.headquarters
      ? (await this.locationAPIService.getLocationModel(companyInfo.headquarters)) ?? null
      : null

    companyModel.locations = companyInfo.locations.length
      ? (await this.locationAPIService.getLocationsModels(companyInfo.locations)) ?? []
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

    companyModel.images = companyInfo.images?.length
      ? await this.fileService.getUploadedFilesModels(companyInfo.images)
      : []

    companyModel.associates = companyInfo.associates.length
      ? await this.associatesService.createAssociatesModels(companyInfo.associates)
      : []

    companyModel.relationships = companyInfo.relationships?.length
      ? await this.companyRelationshipsService.createCompanyRelationshipsModels(
          companyInfo.relationships,
        )
      : []

    return companyModel
  }
}
