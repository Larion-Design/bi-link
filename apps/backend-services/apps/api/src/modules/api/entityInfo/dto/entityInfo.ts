import { Field, ObjectType } from '@nestjs/graphql'
import { EntityInfo as EntityInfoAPI, EntityType } from 'defs'

@ObjectType()
export class EntityInfo implements EntityInfoAPI {
  @Field()
  entityId: string

  @Field(() => String)
  entityType: EntityType
}
