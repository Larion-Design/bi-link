import { Field, ObjectType } from '@nestjs/graphql'
import { Metadata } from './metadata'

@ObjectType()
export class WithMetadata {
  @Field(() => Metadata)
  metadata: Metadata
}
