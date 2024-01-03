import { EntityEventDispatcherService } from '@modules/entity-events'
import { Injectable, Logger } from '@nestjs/common'
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
  private readonly logger = new Logger(CompanyAPIService.name)

  constructor(
    private readonly entityEventDispatcherService: EntityEventDispatcherService,
    private readonly locationAPIService: LocationAPIService,
    private readonly fileService: FileAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly companiesService: CompaniesService,
    private readonly associatesService: AssociatesService,
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
    const companyModel = await this.createCompanyDocument(companyInfo)

    if (companyModel) {
      await this.companiesService.update(companyId, companyModel)
      await this.entityEventDispatcherService.companyUpdated(companyModel)
      return true
    }
  }

  createPendingSnapshot = async (entityId: string, data: CompanyAPIInput, source: UpdateSource) => {
    try {
      const model = await this.createCompanyDocument(data)

      if (model) {
        const snapshotModel = await this.companyPendingSnapshotService.create(
          entityId,
          model,
          source,
        )

        if (snapshotModel) {
          return String(snapshotModel._id)
        }
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  createHistorySnapshot = async (entityId: string, data: CompanyAPIInput, source: UpdateSource) => {
    try {
      const model = await this.createCompanyDocument(data)

      if (model) {
        return this.companyHistorySnapshotService.create(entityId, model, source)
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  private async createCompanyDocument(companyInfo: CompanyAPIInput, companyId?: string) {
    const companyModel = new CompanyModel()

    if (companyId) {
      companyModel._id = companyId
    }

    companyModel.name = companyInfo.name
    companyModel.cui = companyInfo.cui
    companyModel.registrationNumber = companyInfo.registrationNumber

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

    companyModel.associates = companyInfo.associates.length
      ? await this.associatesService.createAssociatesModels(companyInfo.associates)
      : []

    return companyModel
  }
}
