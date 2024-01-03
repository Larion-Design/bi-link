import { Field, ID, InputType } from '@nestjs/graphql'
import { EntityInfo as EntityInfoAPI, EntityType } from 'defs'

@InputType()
export class EntityInfoInput implements EntityInfoAPI {
  @Field(() => ID)
  entityId: string

  @Field(() => String)
  entityType: EntityType
}
