import { Field, InputType } from '@nestjs/graphql'
import { RelationshipInfoFieldAPI } from 'defs'

@InputType()
export class RelationshipInfoFieldInput implements RelationshipInfoFieldAPI {
  @Field()
  targetId: string

  @Field({ nullable: true })
  path?: string

  @Field()
  field: string
}
