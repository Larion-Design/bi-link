import { CompanyAPIInput, PersonAPIInput, ProceedingAPIInput } from 'defs'
import { CompanyTermeneDataset } from '../../schema/company'
import { TermeneProceeding } from '../../schema/courtFiles'

export type ExtractCompanyEvent = {
  cui: string
}

export type TransformCompanyEvent = {
  cui: string
  dataset: CompanyTermeneDataset
  companyInfo: CompanyAPIInput
}

export type LoadCompanyEvent = {
  cui: string
  companyInfo: CompanyAPIInput
}

export type ExtractPersonEvent = {
  personUrl: string
}

export type TransformPersonEvent = {
  name: string
}

export type LoadPersonEvent = {
  personInfo: PersonAPIInput
}

export type ExtractProceedingEvent = {
  fileNumber: string
}

export type TransformProceedingEvent = {
  dataset: TermeneProceeding
}

export type LoadProceedingEvent = {
  proceedingInfo: ProceedingAPIInput
}
