import { CustomField } from '../customField'

export interface Education {
  type: string
  school: string
  specialization: string
  customFields: CustomField[]
  startDate: Date | string | null
  endDate: Date | string | null
}

export interface EducationAPIInput extends Education {}
export interface EducationAPIOutput extends Education {}
