import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ProjectionFields, ProjectionType, Query } from 'mongoose'
import { EventDocument, EventModel } from '@app/models/models/event/eventModel'
import { PersonDocument, PersonModel } from '@app/models/models/person/personModel'
import { CompanyDocument, CompanyModel } from '@app/models/models/company/companyModel'
import { PropertyDocument, PropertyModel } from '@app/models/models/property/propertyModel'
import { ReportDocument, ReportModel } from '@app/models/models/reports/reportModel'
import { EntityInfo } from '@app/rpc/constants'

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
