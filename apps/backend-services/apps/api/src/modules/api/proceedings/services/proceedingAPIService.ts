import {
  CompaniesService,
  PersonsService,
  ProceedingEntityModel,
  ProceedingModel,
} from '@app/models'
import { ProceedingsService } from '@app/models/services/proceedingsService'
import { Injectable, Logger } from '@nestjs/common'
import { ProceedingAPIInput, ProceedingEntityInvolvedAPI } from 'defs'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { FileAPIService } from '../../files/services/fileAPIService'

@Injectable()
export class ProceedingAPIService {
  private readonly logger = new Logger(ProceedingAPIService.name)

  constructor(
    private readonly proceedingsService: ProceedingsService,
    private readonly fileService: FileAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
  ) {}

  create = async (proceedingInfo: ProceedingAPIInput) => {
    try {
      const proceedingModel = await this.createProceedingModel(proceedingInfo)
      const proceedingDocument = await this.proceedingsService.create(proceedingModel)
      return String(proceedingDocument._id)
    } catch (e) {
      this.logger.error(e)
    }
  }

  update = async (proceedingId: string, proceedingInfo: ProceedingAPIInput) => {
    try {
      const proceedingModel = await this.createProceedingModel(proceedingInfo)
      await this.proceedingsService.update(proceedingId, proceedingModel)
      return true
    } catch (e) {
      this.logger.error(e)
    }
  }

  private createProceedingModel = async (proceedingInfo: ProceedingAPIInput) => {
    const proceedingModel = new ProceedingModel()

    proceedingModel.name = proceedingInfo.name
    proceedingModel.type = proceedingInfo.type
    proceedingModel.year = proceedingInfo.year
    proceedingModel.description = proceedingInfo.description
    proceedingModel.fileNumber = proceedingInfo.fileNumber

    proceedingModel.customFields = this.customFieldsService.createCustomFieldsModels(
      proceedingInfo.customFields,
    )

    proceedingModel.files = await this.fileService.getUploadedFilesModels(proceedingInfo.files)
    proceedingModel.entitiesInvolved = await this.createProceedingEntitiesModels(
      proceedingInfo.entitiesInvolved,
    )
    return proceedingModel
  }

  private createProceedingEntitiesModels = async (
    proceedingEntitiesInfo: ProceedingEntityInvolvedAPI[],
  ) => {
    const persons = new Map<string, ProceedingEntityInvolvedAPI>()
    const companies = new Map<string, ProceedingEntityInvolvedAPI>()

    proceedingEntitiesInfo.forEach((proceedingEntityInfo) => {
      if (proceedingEntityInfo.person?._id) {
        persons.set(proceedingEntityInfo.person._id, proceedingEntityInfo)
      } else if (proceedingEntityInfo.company?._id) {
        companies.set(proceedingEntityInfo.company?._id, proceedingEntityInfo)
      }
    })

    const proceedingEntitiesModels: ProceedingEntityModel[] = []

    if (persons.size) {
      const personsDocuments = await this.personsService.getPersons(
        Array.from(persons.keys()),
        false,
      )

      personsDocuments.forEach((personDocument) => {
        const proceedingEntityInfo = persons.get(String(personDocument._id))
        const proceedingEntityModel = new ProceedingEntityModel()
        proceedingEntityModel.involvedAs = proceedingEntityInfo.involvedAs
        proceedingEntityModel.description = proceedingEntityInfo.description
        proceedingEntityModel.person = personDocument

        proceedingEntitiesModels.push(proceedingEntityModel)
      })
    }

    if (companies.size) {
      const companiesDocuments = await this.companiesService.getCompanies(
        Array.from(companies.keys()),
        false,
      )

      companiesDocuments.forEach((companyDocument) => {
        const proceedingEntityInfo = companies.get(String(companyDocument._id))
        const proceedingEntityModel = new ProceedingEntityModel()
        proceedingEntityModel.involvedAs = proceedingEntityInfo.involvedAs
        proceedingEntityModel.description = proceedingEntityInfo.description
        proceedingEntityModel.company = companyDocument

        proceedingEntitiesModels.push(proceedingEntityModel)
      })
    }
    return proceedingEntitiesModels
  }
}
