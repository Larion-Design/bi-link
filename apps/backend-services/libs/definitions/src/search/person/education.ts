import { Education } from 'defs'

export interface EducationIndex
  extends Pick<Education, 'type' | 'school' | 'specialization' | 'customFields'> {
  period: {
    gte: string | null
    lte: string | null
  }
}
