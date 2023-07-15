import { CompanyAPIInput, PersonAPIInput, ProceedingAPIInput } from 'defs'
import { CompanyTermeneDataset } from '../../schema/company'
import { TermeneProceeding } from '../../schema/courtFiles'

export type ExtractCompanyEvent = {
  cui: string
  companyId?: string
}

export type TransformCompanyEvent = {
  cui: string
  dataset: CompanyTermeneDataset
  companyId?: string
  companyInfo: CompanyAPIInput
}

export type LoadCompanyEvent = {
  companyId?: string
  companyInfo: CompanyAPIInput
}

export type ExtractPersonEvent = {
  personUrl: string
}

export type TransformPersonEvent = {
  name: string
}

export type LoadPersonEvent = {
  personId?: string
  personInfo: PersonAPIInput
}

export type ExtractProceedingEvent = {
  fileNumber: string
}

export type TransformProceedingEvent = {
  dataset: TermeneProceeding
}

export type LoadProceedingEvent = {
  proceedingId?: string
  proceedingInfo: ProceedingAPIInput
}
