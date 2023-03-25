import { Field, InterfaceType } from '@nestjs/graphql'
import { Metadata } from './metadata'

@InterfaceType()
export abstract class WithMetadata {
  @Field(() => Metadata)
  metadata: Metadata
}
