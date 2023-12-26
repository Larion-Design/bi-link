import { ObjectType, PickType } from '@nestjs/graphql'
import { ReportListRecord as ReportListRecordType } from 'defs'
import { Report } from './report'

@ObjectType()
export class ReportListRecord
  extends PickType(Report, ['_id', 'name', 'type'] as const)
  implements ReportListRecordType {}
