import { Injectable, Logger } from '@nestjs/common'
import { IncidentAPIInput } from '@app/definitions/incident'
import { FileAPIService } from '../../files/services/fileAPIService'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { IncidentModel } from '@app/entities/models/incidentModel'
import { IncidentsService } from '@app/entities/services/incidentsService'
import { PartyAPIService } from './partyAPIService'

@Injectable()
export class IncidentAPIService {
  private readonly logger = new Logger(IncidentAPIService.name)

  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly fileService: FileAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly partyService: PartyAPIService,
  ) {}

  create = async (incidentInfo: IncidentAPIInput) => {
    try {
      const incidentModel = await this.createIncidentDocument(incidentInfo)
      const incidentDocument = await this.incidentsService.create(incidentModel)
      return String(incidentDocument._id)
    } catch (error) {
      this.logger.error(error)
    }
  }

  update = async (incidentId: string, incidentInfo: IncidentAPIInput) => {
    try {
      const incidentModel = await this.createIncidentDocument(incidentInfo)
      await this.incidentsService.update(incidentId, incidentModel)
      return true
    } catch (error) {
      this.logger.error(error)
    }
  }

  private createIncidentDocument = async (incidentInfo: IncidentAPIInput) => {
    const incidentModel = new IncidentModel()
    incidentModel.date = new Date(incidentInfo.date)
    incidentModel.location = incidentInfo.location

    if (incidentInfo.parties?.length) {
      incidentModel.parties = await this.partyService.createPartiesModelsFromInputData(
        incidentInfo.parties,
      )
    }

    if (incidentInfo.customFields?.length) {
      incidentModel.customFields = this.customFieldsService.getCustomFieldsDocumentsForInputData(
        incidentInfo.customFields,
      )
    }

    if (incidentInfo.files?.length) {
      incidentModel.files = await this.fileService.getUploadedFilesModels(incidentInfo.files)
    }
    return incidentModel
  }
}
