import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { Proceeding } from './proceeding'
import { ProceedingListRecord as ProceedingListRecordType } from 'defs'

@ObjectType()
export class ProceedingListRecord
  extends PickType(Proceeding, ['_id', 'name', 'type'] as const)
  implements ProceedingListRecordType
{
  @Field()
  fileNumber: string

  @Field()
  year: number
}
