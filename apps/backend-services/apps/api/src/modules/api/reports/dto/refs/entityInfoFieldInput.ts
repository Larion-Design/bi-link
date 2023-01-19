import { Field, InputType } from '@nestjs/graphql'
import { EntityInfoFieldAPI } from 'defs'

@InputType()
export class EntityInfoFieldInput implements EntityInfoFieldAPI {
  @Field({ nullable: true })
  path?: string

  @Field()
  field: string
}
