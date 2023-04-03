import { InjectModel } from '@nestjs/mongoose'
import { DataRefAPI } from 'defs'
import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { CompanyDocument, CompanyModel } from '../../company/models/companyModel'
import { EventDocument, EventModel } from '../../event/models/eventModel'
import { LocationDocument, LocationModel } from '../../location/models/locationModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import { ProceedingDocument, ProceedingModel } from '../../proceeding/models/proceedingModel'
import { PropertyDocument, PropertyModel } from '../../property/models/propertyModel'
import { DataRefModel } from '../models/dataRefModel'

@Injectable()
export class ReportRefsAPIService {
  constructor(
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(PropertyModel.name) private readonly propertyModel: Model<PropertyDocument>,
    @InjectModel(EventModel.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(ProceedingModel.name) private readonly proceedingModel: Model<ProceedingDocument>,
    @InjectModel(LocationModel.name) private readonly locationModel: Model<LocationDocument>,
  ) {}

  createRefsModels = async (dataRefs: DataRefAPI[]): Promise<DataRefModel[]> => {
    const companiesDataRefs = new Map<string, DataRefAPI>()
    const personsDataRefs = new Map<string, DataRefAPI>()
    const propertiesDataRefs = new Map<string, DataRefAPI>()
    const eventsDataRefs = new Map<string, DataRefAPI>()
    const proceedingsDataRefs = new Map<string, DataRefAPI>()
    const locationsDataRefs = new Map<string, DataRefAPI>()

    dataRefs.forEach((dataRef) => {
      const { person, company, property, proceeding, event, location } = dataRef

      if (person?._id) {
        personsDataRefs.set(person._id, dataRef)
      } else if (company?._id) {
        companiesDataRefs.set(company._id, dataRef)
      } else if (property?._id) {
        companiesDataRefs.set(property._id, dataRef)
      } else if (event?._id) {
        companiesDataRefs.set(event._id, dataRef)
      } else if (proceeding?._id) {
        companiesDataRefs.set(proceeding._id, dataRef)
      } else if (location?._id) {
        locationsDataRefs.set(location._id, dataRef)
      }
    })

    return [
      ...(await this.createRefsForPersons(personsDataRefs)),
      ...(await this.createRefsForCompanies(companiesDataRefs)),
      ...(await this.createRefsForProperties(propertiesDataRefs)),
      ...(await this.createRefsForEvents(eventsDataRefs)),
      ...(await this.createRefsForProceedings(proceedingsDataRefs)),
      ...(await this.createRefsForLocations(locationsDataRefs)),
    ]
  }

  private createRefsForPersons = async (dataRefs: Map<string, DataRefAPI>) => {
    if (dataRefs.size) {
      const personsDocuments = await this.personModel.find({ _id: Array.from(dataRefs.keys()) })
      return personsDocuments.map((personDocument) => {
        const dataRef = dataRefs.get(String(personDocument._id))!
        const ref = this.createRefModel(dataRef)
        ref.person = personDocument
        return ref
      })
    }
    return []
  }

  private createRefsForCompanies = async (dataRefs: Map<string, DataRefAPI>) => {
    if (dataRefs.size) {
      const companiesDocuments = await this.companyModel.find({ _id: Array.from(dataRefs.keys()) })
      return companiesDocuments.map((companyDocument) => {
        const dataRef = dataRefs.get(String(companyDocument._id))!
        const ref = this.createRefModel(dataRef)
        ref.company = companyDocument
        return ref
      })
    }
    return []
  }

  private createRefsForProperties = async (dataRefs: Map<string, DataRefAPI>) => {
    if (dataRefs.size) {
      const propertiesDocuments = await this.propertyModel.find({
        _id: Array.from(dataRefs.keys()),
      })
      return propertiesDocuments.map((propertyDocument) => {
        const dataRef = dataRefs.get(String(propertyDocument._id))!
        const ref = this.createRefModel(dataRef)
        ref.property = propertyDocument
        return ref
      })
    }
    return []
  }

  private createRefsForEvents = async (dataRefs: Map<string, DataRefAPI>) => {
    if (dataRefs.size) {
      const eventsDocuments = await this.eventModel.find({
        _id: Array.from(dataRefs.keys()),
      })
      return eventsDocuments.map((eventDocument) => {
        const dataRef = dataRefs.get(String(eventDocument._id))!
        const ref = this.createRefModel(dataRef)
        ref.event = eventDocument
        return ref
      })
    }
    return []
  }

  private createRefsForProceedings = async (dataRefs: Map<string, DataRefAPI>) => {
    if (dataRefs.size) {
      const proceedingsDocuments = await this.proceedingModel.find({
        _id: Array.from(dataRefs.keys()),
      })
      return proceedingsDocuments.map((proceedingDocument) => {
        const dataRef = dataRefs.get(String(proceedingDocument._id))!
        const ref = this.createRefModel(dataRef)
        ref.proceeding = proceedingDocument
        return ref
      })
    }
    return []
  }

  private createRefsForLocations = async (dataRefs: Map<string, DataRefAPI>) => {
    if (dataRefs.size) {
      const locationsDocuments = await this.proceedingModel.find({
        _id: Array.from(dataRefs.keys()),
      })
      return locationsDocuments.map((locationDocument) => {
        const dataRef = dataRefs.get(String(locationDocument._id))!
        const ref = this.createRefModel(dataRef)
        ref.location = locationDocument
        return ref
      })
    }
    return []
  }

  private createRefModel = (dataRef: DataRefAPI) => {
    const ref = new DataRefModel()
    ref._id = dataRef._id
    ref.field = dataRef.field
    ref.targetId = dataRef.targetId
    ref.path = dataRef.path
    return ref
  }
}
