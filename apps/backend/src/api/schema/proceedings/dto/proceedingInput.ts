import { Field, InputType, PickType } from '@nestjs/graphql'
import { ProceedingAPIInput } from 'defs'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { OptionalDateValueInput } from '../../generic/dto/optionalDateValueInput'
import { TextValueInput } from '../../generic/dto/textValueInput'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'
import { ProceedingEntityInput } from './proceedingEntityInput'

@InputType()
export class ProceedingInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements ProceedingAPIInput
{
  @Field(() => TextValueInput)
  fileNumber: TextValueInput

  @Field()
  name: string

  @Field()
  description: string

  @Field(() => TextValueInput)
  status: TextValueInput

  @Field(() => [ProceedingEntityInput])
  entitiesInvolved: ProceedingEntityInput[]

  @Field(() => TextValueInput)
  reason: TextValueInput

  @Field()
  type: string

  @Field(() => OptionalDateValueInput)
  year: OptionalDateValueInput

  @Field(() => [FileInput])
  files: FileInput[]

  @Field(() => [CustomFieldInput])
  customFields: CustomFieldInput[]
}
