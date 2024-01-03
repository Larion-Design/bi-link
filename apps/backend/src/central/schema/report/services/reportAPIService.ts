import { Injectable } from '@nestjs/common'
import { ReportAPIInput } from 'defs'
import { ReportSectionInput } from '@modules/api/schema/reports/dto/reportSectionInput'
import { CompaniesService } from '../../company/services/companiesService'
import { EventsService } from '../../event/services/eventsService'
import { PersonsService } from '../../person/services/personsService'
import { PropertiesService } from '../../property/services/propertiesService'
import { ReportModel } from '../models/reportModel'
import { ReportSectionModel } from '../models/reportSectionModel'
import { ReportContentAPIService } from './reportContentAPIService'
import { ReportRefsAPIService } from './reportRefsAPIService'
import { ReportsService } from './reportsService'

@Injectable()
export class ReportAPIService {
  constructor(
    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly eventsService: EventsService,
    private readonly propertiesService: PropertiesService,
    private readonly reportsService: ReportsService,
    private readonly reportContentAPIService: ReportContentAPIService,
    private readonly reportRefsAPIService: ReportRefsAPIService,
  ) {}

  createReport = async (reportInput: ReportAPIInput) => {
    const reportModel = await this.createReportDocument(reportInput)
    const reportDocument = await this.reportsService.createReport(reportModel)

    if (reportDocument) {
      return String(reportDocument._id)
    }
  }

  updateReport = async (reportId: string, reportInput: ReportAPIInput) => {
    const reportModel = await this.createReportDocument(reportInput)
    await this.reportsService.updateReport(reportId, reportModel)
    return true
  }

  private createReportDocument = async (reportInput: ReportAPIInput) => {
    const reportModel = new ReportModel()
    reportModel.name = reportInput.name
    reportModel.type = reportInput.type
    reportModel.isTemplate = reportInput.isTemplate

    if (!reportInput.isTemplate) {
      if (reportInput.company?._id) {
        reportModel.company = await this.companiesService.getCompany(reportInput.company._id, false)
      }
      if (reportInput.person?._id) {
        reportModel.person = await this.personsService.find(reportInput.person._id, false)
      }
      if (reportInput.event?._id) {
        reportModel.event = await this.eventsService.getEvent(reportInput.event._id, false)
      }
      if (reportInput.property?._id) {
        const propertyModel = await this.propertiesService.getProperty(
          reportInput.property._id,
          false,
        )

        if (propertyModel) {
          reportModel.property = propertyModel
        }
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
