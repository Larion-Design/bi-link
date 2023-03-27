import { ObjectType, PickType } from '@nestjs/graphql'
import { Proceeding } from './proceeding'
import { ProceedingListRecord as ProceedingListRecordType } from 'defs'

@ObjectType()
export class ProceedingListRecord
  extends PickType(Proceeding, ['_id', 'name', 'type', 'fileNumber', 'year'] as const)
  implements ProceedingListRecordType {}
