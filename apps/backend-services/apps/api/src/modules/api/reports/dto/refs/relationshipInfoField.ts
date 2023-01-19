import { Field, ObjectType } from '@nestjs/graphql'
import { RelationshipInfoFieldAPI } from 'defs'

@ObjectType()
export class RelationshipInfoField implements RelationshipInfoFieldAPI {
  @Field()
  targetId: string

  @Field({ nullable: true })
  path?: string

  @Field()
  field: string
}
