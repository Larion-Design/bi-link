import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectedEntity } from '../../common/dto/connectedEntity'
import { RelationshipAPIOutput } from 'defs'

@ObjectType()
export class Relationship implements RelationshipAPIOutput {
  @Field()
  type: string

  @Field()
  proximity: number

  @Field(() => ConnectedEntity)
  person: ConnectedEntity

  @Field({ nullable: true, defaultValue: true })
  _confirmed: boolean
}
