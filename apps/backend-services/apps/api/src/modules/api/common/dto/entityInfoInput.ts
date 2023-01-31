import { Field, InputType } from '@nestjs/graphql'
import { IsMongoId } from 'class-validator'
import { EntityType } from 'defs'

@InputType()
export class EntityInfoInput {
  @IsMongoId()
  @Field()
  entityId: string

  @Field(() => String)
  entityType: EntityType
}
