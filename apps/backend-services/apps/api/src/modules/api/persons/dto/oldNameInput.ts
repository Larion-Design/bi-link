import { Field, InputType, PickType } from '@nestjs/graphql'
import { OldNameAPI } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class OldNameInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements OldNameAPI
{
  @Field()
  name: string

  @Field()
  changeReason: string
}
