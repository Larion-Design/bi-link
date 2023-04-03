import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { EntityInfo } from 'defs'
import { Model, ProjectionFields, ProjectionType, Query } from 'mongoose'
import { CompanyDocument, CompanyModel } from '../../company/models/companyModel'
import { EventDocument, EventModel } from '../../event/models/eventModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import { PropertyDocument, PropertyModel } from '../../property/models/propertyModel'
import { ReportDocument, ReportModel } from '../models/reportModel'

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name)

  constructor(
    @InjectModel(ReportModel.name) private readonly reportModel: Model<ReportDocument>,
    @InjectModel(EventModel.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(PropertyModel.name) private readonly propertyModel: Model<PropertyDocument>,
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
  ) {}

  createReport = async (reportModel: ReportModel) => {
    try {
      return this.reportModel.create(reportModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  updateReport = async (reportId: string, reportModel: ReportModel) => {
    try {
      return this.reportModel.findByIdAndUpdate(reportId, reportModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getReport = async (reportId: string, fetchLinkedEntities: boolean) => {
    try {
      const query = this.reportModel.findById(reportId)
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  getReports = async (reportsIds: string[], fetchLinkedEntities: boolean) => {
    try {
      const query = this.reportModel.find({ _id: reportsIds })
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  getEntityReports = async ({ entityId, entityType }: EntityInfo) => {
    try {
      const projection: ProjectionType<ReportDocument> = {
        _id: 1,
        name: 1,
      }

      switch (entityType) {
        case 'PERSON': {
          return this.reportModel.find({ person: entityId, isTemplate: false }, projection)
        }
        case 'COMPANY': {
          return this.reportModel.find({ company: entityId, isTemplate: false }, projection)
        }
        case 'PROPERTY': {
          return this.reportModel.find({ property: entityId, isTemplate: false }, projection)
        }
        case 'EVENT': {
          return this.reportModel.find({ event: entityId, isTemplate: false }, projection)
        }
        case 'PROCEEDING': {
          return this.reportModel.find({ proceeding: entityId, isTemplate: false }, projection)
        }
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  getReportTemplates = async () => {
    try {
      return this.reportModel.find(
        { isTemplate: true },
        {
          _id: 1,
          name: 1,
        },
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  async *getAllReports(fields: ProjectionFields<ReportDocument> = { _id: 1 }) {
    for await (const model of this.reportModel.find({}, fields)) {
      yield model
    }
  }

  private getLinkedEntities = (query: Query<any, ReportDocument>) =>
    query
      .populate({ path: 'person', model: this.personModel })
      .populate({ path: 'company', model: this.companyModel })
      .populate({ path: 'property', model: this.propertyModel })
      .populate({ path: 'event', model: this.eventModel })
}
