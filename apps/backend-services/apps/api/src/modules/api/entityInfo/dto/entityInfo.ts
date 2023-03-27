import { Field, ID, ObjectType } from '@nestjs/graphql'
import { EntityInfo as EntityInfoAPI, EntityType } from 'defs'

@ObjectType()
export class EntityInfo implements EntityInfoAPI {
  @Field(() => ID)
  entityId: string

  @Field(() => String)
  entityType: EntityType
}
