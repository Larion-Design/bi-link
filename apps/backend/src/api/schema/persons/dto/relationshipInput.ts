import { Field, InputType, PickType } from '@nestjs/graphql'
import { ConnectedEntityInput } from '../../entityInfo/dto/connectedEntityInput'
import { RelationshipAPI } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class RelationshipInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements RelationshipAPI
{
  @Field()
  readonly description: string

  @Field()
  readonly type: string

  @Field()
  readonly proximity: number

  @Field(() => ConnectedEntityInput)
  readonly person: ConnectedEntityInput

  @Field(() => [ConnectedEntityInput])
  readonly relatedPersons: ConnectedEntityInput[]

  @Field({ nullable: true, defaultValue: true })
  readonly _confirmed: boolean
}
