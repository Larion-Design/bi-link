import { Field, InterfaceType } from '@nestjs/graphql'

@InterfaceType()
export abstract class WithTimestamps {
  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
