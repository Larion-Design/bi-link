import { Injectable, Logger } from '@nestjs/common'
import { EventAPIInput } from 'defs'
import { LocationAPIService } from '../../common/services/locationAPIService'
import { FileAPIService } from '../../files/services/fileAPIService'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { EventModel } from '@app/entities/models/event/eventModel'
import { EventsService } from '@app/entities/services/eventsService'
import { PartyAPIService } from './partyAPIService'

@Injectable()
export class EventAPIService {
  private readonly logger = new Logger(EventAPIService.name)

  constructor(
    private readonly eventsService: EventsService,
    private readonly fileService: FileAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly partyService: PartyAPIService,
    private readonly locationService: LocationAPIService,
  ) {}

  create = async (eventInfo: EventAPIInput) => {
    try {
      const eventModel = await this.createEventDocument(eventInfo)
      const eventDocument = await this.eventsService.create(eventModel)
      return String(eventDocument._id)
    } catch (error) {
      this.logger.error(error)
    }
  }

  update = async (eventId: string, eventInfo: EventAPIInput) => {
    try {
      const eventModel = await this.createEventDocument(eventInfo)
      await this.eventsService.update(eventId, eventModel)
      return true
    } catch (error) {
      this.logger.error(error)
    }
  }

  private createEventDocument = async (eventInfo: EventAPIInput) => {
    const eventModel = new EventModel()
    eventModel.date = eventInfo.date
    eventModel.location = await this.locationService.getLocationModel(eventInfo.location)
    eventModel.parties = await this.partyService.createPartiesModels(eventInfo.parties)

    eventModel.customFields = this.customFieldsService.createCustomFieldsModels(
      eventInfo.customFields,
    )

    eventModel.files = await this.fileService.getUploadedFilesModels(eventInfo.files)
    return eventModel
  }
}
