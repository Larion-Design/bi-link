import {ReportDocument, ReportModel} from '@app/entities/models/reportModel'
import {Injectable, Logger} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'

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
}
