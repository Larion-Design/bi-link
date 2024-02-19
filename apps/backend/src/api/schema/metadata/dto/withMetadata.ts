import { Field, ObjectType } from '@nestjs/graphql'
import { getDefaultMetadata } from 'default-values'
import { Metadata } from './metadata'

@ObjectType()
export class WithMetadata {
  @Field(() => Metadata, { defaultValue: getDefaultMetadata() })
  metadata: Metadata
}
