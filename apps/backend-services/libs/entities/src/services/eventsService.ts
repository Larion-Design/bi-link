import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ProjectionFields, Query } from 'mongoose'
import { LocationDocument, LocationModel } from '@app/entities/models/locationModel'
import { FileDocument, FileModel } from '@app/entities/models/fileModel'
import { EventDocument, EventModel } from '@app/entities/models/event/eventModel'
import { PersonDocument, PersonModel } from '@app/entities/models/person/personModel'
import { PartyDocument, PartyModel } from '@app/entities/models/event/partyModel'
import { CompanyDocument, CompanyModel } from '@app/entities/models/company/companyModel'
import { PropertyDocument, PropertyModel } from '@app/entities/models/property/propertyModel'

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name)
  constructor(
    @InjectModel(EventModel.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(PartyModel.name) private readonly partyModel: Model<PartyDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(PropertyModel.name) private readonly propertyModel: Model<PropertyDocument>,
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>,
    @InjectModel(LocationModel.name) private readonly locationModel: Model<LocationDocument>,
  ) {}

  create = async (eventModel: EventModel) => this.eventModel.create(eventModel)

  update = async (eventId: string, incidentModel: EventModel) =>
    this.eventModel.findByIdAndUpdate(eventId, incidentModel)

  async *getAllEvents(fields: ProjectionFields<EventDocument> = { _id: 1 }) {
    for await (const incidentDocument of this.eventModel.find({}, fields)) {
      yield incidentDocument
    }
  }

  getEvent = async (eventId: string, fetchLinkedEntities: boolean) => {
    try {
      const query = this.eventModel.findById(eventId)
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  getEvents = async (eventsIds: string[], fetchLinkedEntities: boolean) => {
    try {
      const query = this.eventModel.find({ _id: eventsIds })
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  private getLinkedEntities = (query: Query<any, EventDocument>) =>
    query
      .populate({ path: 'location', model: this.locationModel })
      .populate({ path: 'files', model: this.fileModel })
      .populate({ path: 'parties', model: this.partyModel })
      .populate({ path: 'parties.persons', model: this.personModel })
      .populate({ path: 'parties.properties', model: this.propertyModel })
      .populate({ path: 'parties.companies', model: this.companyModel })
}
