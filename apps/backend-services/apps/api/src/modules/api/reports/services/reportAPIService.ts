import { ReportModel } from '@app/entities/models/reports/reportModel'
import { ReportSectionModel } from '@app/entities/models/reports/reportSectionModel'
import { CompaniesService } from '@app/entities/services/companiesService'
import { IncidentsService } from '@app/entities/services/incidentsService'
import { PersonsService } from '@app/entities/services/personsService'
import { PropertiesService } from '@app/entities/services/propertiesService'
import { ReportsService } from '@app/entities/services/reportsService'
import { Injectable } from '@nestjs/common'
import { ReportInput } from '../dto/reportInput'
import { ReportSectionInput } from '../dto/reportSectionInput'
import { ReportContentAPIService } from './reportContentAPIService'
import { ReportRefsAPIService } from './reportRefsAPIService'

@Injectable()
export class ReportAPIService {
  constructor(
    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly incidentsService: IncidentsService,
    private readonly propertiesService: PropertiesService,
    private readonly reportsService: ReportsService,
    private readonly reportContentAPIService: ReportContentAPIService,
    private readonly reportRefsAPIService: ReportRefsAPIService,
  ) {}

  createReport = async (reportInput: ReportInput) => {
    const reportModel = await this.createReportDocument(reportInput)
    const reportDocument = await this.reportsService.createReport(reportModel)
    return String(reportDocument._id)
  }

  updateReport = async (reportId: string, reportInput: ReportInput) => {
    const reportModel = await this.createReportDocument(reportInput)
    await this.reportsService.updateReport(reportId, reportModel)
    return true
  }

  private createReportDocument = async (reportInput: ReportInput) => {
    const reportModel = new ReportModel()
    reportModel.name = reportInput.name
    reportModel.type = reportInput.type
    reportModel.isTemplate = reportInput.isTemplate

    if (!reportInput.isTemplate) {
      if (reportInput.company?._id) {
        reportModel.company = await this.companiesService.getCompany(reportInput.company._id)
      }
      if (reportInput.person?._id) {
        reportModel.person = await this.personsService.find(reportInput.person._id)
      }
      if (reportInput.incident?._id) {
        reportModel.incident = await this.incidentsService.getIncident(reportInput.incident._id)
      }
      if (reportInput.property?._id) {
        reportModel.property = await this.propertiesService.getProperty(reportInput.property._id)
      }
    }

    reportModel.refs = await this.reportRefsAPIService.createRefsModels(reportInput.refs)
    reportModel.sections = await Promise.all(reportInput.sections.map(this.createReportSections))
    return reportModel
  }

  private createReportSections = async (reportSectionInput: ReportSectionInput) => {
    const sectionModel = new ReportSectionModel()
    sectionModel.name = reportSectionInput.name
    sectionModel.content = await Promise.all(
      reportSectionInput.content.map(this.reportContentAPIService.createReportContentModel),
    )
    return sectionModel
  }
}
