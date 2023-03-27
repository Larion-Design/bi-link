import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { ProceedingAPIOutput } from 'defs'
import { Timestamps } from 'defs/dist/modelTimestamps'
import { CustomField } from '../../customFields/dto/customField'
import { File } from '../../files/dto/file'
import { NumberValue } from '../../generic/dto/numberValue'
import { TextValue } from '../../generic/dto/textValue'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { ProceedingEntity } from './proceedingEntity'

@ObjectType()
export class Proceeding
  extends PickType(WithMetadata, ['metadata'] as const)
  implements ProceedingAPIOutput, Timestamps
{
  @Field(() => ID)
  _id: string

  @Field(() => TextValue)
  fileNumber: TextValue

  @Field()
  name: string

  @Field()
  description: string

  @Field(() => [ProceedingEntity])
  entitiesInvolved: ProceedingEntity[]

  @Field(() => TextValue)
  reason: TextValue

  @Field()
  type: string

  @Field(() => NumberValue)
  year: NumberValue

  @Field(() => [File])
  files: File[]

  @Field(() => [CustomField])
  customFields: CustomField[]

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
