import { Field, InputType } from '@nestjs/graphql'
import { ProceedingAPIInput } from 'defs'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { ProceedingEntityInput } from './proceedingEntityInput'

@InputType()
export class ProceedingInput implements ProceedingAPIInput {
  @Field()
  fileNumber: string

  @Field()
  name: string

  @Field()
  description: string

  @Field(() => [ProceedingEntityInput])
  entitiesInvolved: ProceedingEntityInput[]

  @Field()
  reason: string

  @Field()
  type: string

  @Field()
  year: number

  @Field(() => [FileInput])
  files: FileInput[]

  @Field(() => [CustomFieldInput])
  customFields: CustomFieldInput[]
}
