import { Field, InputType, PickType } from '@nestjs/graphql'
import { ProceedingAPIInput } from 'defs'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { NumberValue } from '../../generic/dto/numberValue'
import { TextValue } from '../../generic/dto/textValue'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'
import { ProceedingEntityInput } from './proceedingEntityInput'

@InputType()
export class ProceedingInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements ProceedingAPIInput
{
  @Field(() => TextValue)
  fileNumber: TextValue

  @Field()
  name: string

  @Field()
  description: string

  @Field(() => [ProceedingEntityInput])
  entitiesInvolved: ProceedingEntityInput[]

  @Field(() => TextValue)
  reason: TextValue

  @Field()
  type: string

  @Field(() => NumberValue)
  year: NumberValue

  @Field(() => [FileInput])
  files: FileInput[]

  @Field(() => [CustomFieldInput])
  customFields: CustomFieldInput[]
}
