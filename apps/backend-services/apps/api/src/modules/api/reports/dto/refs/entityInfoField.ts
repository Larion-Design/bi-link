import { Field, ObjectType } from '@nestjs/graphql'
import { EntityInfoFieldAPI } from 'defs'

@ObjectType()
export class EntityInfoField implements EntityInfoFieldAPI {
  @Field({ nullable: true })
  path?: string

  @Field()
  field: string
}
