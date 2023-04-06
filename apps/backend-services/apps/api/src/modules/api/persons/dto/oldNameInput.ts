import { Field, InputType, PickType } from '@nestjs/graphql'
import { OldName } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class OldNameInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements OldName
{
  @Field()
  name: string

  @Field()
  changeReason: string
}
