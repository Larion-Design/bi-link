import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectedEntity as ConnectedEntityType } from 'defs'

@ObjectType()
export class ConnectedEntity implements ConnectedEntityType {
  @Field()
  _id: string

  @Field({ nullable: true })
  _confirmed?: boolean

  constructor(id?: string) {
    if (id) {
      this._id = id
    }
  }
}
