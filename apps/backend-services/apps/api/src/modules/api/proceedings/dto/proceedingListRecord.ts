import { ObjectType, PickType } from '@nestjs/graphql'
import { Proceeding } from './proceeding'

@ObjectType()
export class ProceedingListRecord extends PickType(Proceeding, [
  '_id',
  'name',
  'type',
  'fileNumber',
  'year',
]) {}
