import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ProjectionFields, Query } from 'mongoose'
import { CompanyDocument, CompanyModel } from '../../company/models/companyModel'
import { FileDocument, FileModel } from '../../file/models/fileModel'
import { LocationDocument, LocationModel } from '../../location/models/locationModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import { PropertyDocument, PropertyModel } from '../../property/models/propertyModel'
import { EventDocument, EventModel } from '../models/eventModel'
import { PartyDocument, PartyModel } from '../models/partyModel'

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name)
  constructor(
    @InjectModel(EventModel.name)
    private readonly eventModel: Model<EventDocument>,
    @InjectModel(PartyModel.name)
    private readonly partyModel: Model<PartyDocument>,
    @InjectModel(PersonModel.name)
    private readonly personModel: Model<PersonDocument>,
    @InjectModel(PropertyModel.name)
    private readonly propertyModel: Model<PropertyDocument>,
    @InjectModel(CompanyModel.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(FileModel.name)
    private readonly fileModel: Model<FileDocument>,
    @InjectModel(LocationModel.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  create = async (eventModel: EventModel) => this.eventModel.create(eventModel)

  update = async (eventId: string, eventModel: EventModel) =>
    this.eventModel.findByIdAndUpdate(eventId, eventModel)

  async *getAllEvents(fields: ProjectionFields<EventDocument> = { _id: 1 }) {
    for await (const eventDocument of this.eventModel.find({}, fields)) {
      yield eventDocument
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
      if (eventsIds.length) {
        const query = this.eventModel.find({ _id: eventsIds })
        return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
      }
      return []
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
