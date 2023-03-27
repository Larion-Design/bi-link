import { Field, InputType, PickType } from '@nestjs/graphql'
import { ProceedingEntityInvolvedAPI } from 'defs'
import { ConnectedEntityInput } from '../../entityInfo/dto/connectedEntityInput'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class ProceedingEntityInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements ProceedingEntityInvolvedAPI
{
  @Field(() => ConnectedEntityInput, { nullable: true })
  person: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  company?: ConnectedEntityInput

  @Field()
  description: string

  @Field()
  involvedAs: string
}
