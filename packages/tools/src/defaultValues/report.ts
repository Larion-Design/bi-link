import { ReportAPIInput, ReportContentAPIInput, ReportSectionAPIInput } from 'defs'

export const getDefaultReport = (): ReportAPIInput => ({
  name: '',
  type: '',
  isTemplate: false,
  sections: [],
  refs: [],
})

export const getDefaultReportSection = (): ReportSectionAPIInput => ({
  name: '',
  content: [],
})

export const getDefaultReportContentText = (order = 0): ReportContentAPIInput => ({
  isActive: true,
  order,
  text: { content: '' },
})
