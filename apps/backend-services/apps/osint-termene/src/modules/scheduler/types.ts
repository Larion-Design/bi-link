import { CompanyAPIInput, ProceedingAPIInput } from 'defs'
import { CompanyTermeneDataset } from '../../schema/company'
import { TermeneProceeding } from '../../schema/courtFiles'

export type ProcessCompanyEvent = {
  cui: string
  dataset?: CompanyTermeneDataset
  companyInfo?: CompanyAPIInput
}

export type ProcessPersonEvent = {
  personUrl: string
}

export type ProcessProceedingEvent = {
  dataset?: TermeneProceeding
  proceedingInfo?: ProceedingAPIInput
}
