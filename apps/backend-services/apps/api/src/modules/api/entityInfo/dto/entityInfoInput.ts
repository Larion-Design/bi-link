import { Field, InputType } from '@nestjs/graphql'
import { EntityInfo as EntityInfoAPI, EntityType } from 'defs'

@InputType()
export class EntityInfoInput implements EntityInfoAPI {
  @Field()
  entityId: string

  @Field(() => String)
  entityType: EntityType
}
