import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { ConnectedEntity } from '../../entityInfo/dto/connectedEntity'
import { RelationshipAPI } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class Relationship
  extends PickType(WithMetadata, ['metadata'] as const)
  implements RelationshipAPI
{
  @Field({ defaultValue: '' })
  description: string

  @Field()
  type: string

  @Field()
  proximity: number

  @Field(() => ConnectedEntity)
  person: ConnectedEntity

  @Field(() => [ConnectedEntity])
  relatedPersons: ConnectedEntity[]
}
