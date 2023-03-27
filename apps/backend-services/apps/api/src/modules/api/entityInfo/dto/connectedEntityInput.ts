import { Field, ID, InputType } from '@nestjs/graphql'
import { ConnectedEntity as ConnectedEntityType } from 'defs'

@InputType()
export class ConnectedEntityInput implements ConnectedEntityType {
  @Field(() => ID)
  _id: string
}
