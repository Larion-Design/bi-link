import {
  ReportContent,
  ReportContentAPIInput,
  ReportContentAPIOutput,
} from '@app/definitions/reports/reportContent'

export interface ReportSection {
  name: string
  content: ReportContent[]
}

export interface ReportSectionAPI extends Omit<ReportSection, 'content'> {}

export interface ReportSectionAPIInput extends ReportSectionAPI {
  content: ReportContentAPIInput[]
}

export interface ReportSectionAPIOutput extends ReportSectionAPI {
  content: ReportContentAPIOutput[]
}
