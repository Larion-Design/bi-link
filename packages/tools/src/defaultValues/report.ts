import { ReportAPIInput, ReportContentAPIInput } from 'defs'

export const getDefaultReport = (): ReportAPIInput => ({
  name: '',
  type: '',
  isTemplate: false,
  sections: [],
  refs: [],
})

export const getDefaultReportContentText = (order = 0): ReportContentAPIInput => ({
  isActive: true,
  order,
  text: { content: '' },
})
