import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ProjectionType } from 'mongoose'
import { ReportDocument, ReportModel } from '@app/entities/models/reports/reportModel'
import { EntityInfo } from '@app/pub/constants'

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name)

  constructor(@InjectModel(ReportModel.name) private readonly reportModel: Model<ReportDocument>) {}

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

  getReport = async (reportId: string) => {
    try {
      return this.reportModel.findById(reportId)
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
        case 'INCIDENT': {
          return this.reportModel.find({ incident: entityId, isTemplate: false }, projection)
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
}
