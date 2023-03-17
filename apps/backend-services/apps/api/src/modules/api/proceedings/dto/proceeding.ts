import { Field, ObjectType } from '@nestjs/graphql'
import { ProceedingAPIOutput } from 'defs'
import { CustomField } from '../../customFields/dto/customField'
import { ProceedingEntity } from './proceedingEntity'

@ObjectType()
export class Proceeding implements ProceedingAPIOutput {
  @Field()
  _id: string

  @Field()
  fileNumber: string

  @Field()
  name: string

  @Field()
  description: string

  @Field(() => [ProceedingEntity])
  entitiesInvolved: ProceedingEntity[]

  @Field()
  reason: string

  @Field()
  type: string

  @Field()
  year: number

  @Field(() => [CustomField])
  customFields: CustomField[]
}
