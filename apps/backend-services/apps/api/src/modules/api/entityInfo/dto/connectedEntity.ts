import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ConnectedEntity as ConnectedEntityType } from 'defs'

@ObjectType()
export class ConnectedEntity implements ConnectedEntityType {
  @Field(() => ID)
  _id: string
}
