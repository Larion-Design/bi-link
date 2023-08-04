import { CompanyAPIInput, ProceedingAPIInput } from 'defs'
import { CompanyTermeneDataset } from '../../schema/company'
import { TermeneProceeding } from '../../schema/courtFiles'

type ProcessorStage = 'EXTRACT' | 'TRANSFORM' | 'LOAD'

export type TaskProgress = object & {
  stage: ProcessorStage
}

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
