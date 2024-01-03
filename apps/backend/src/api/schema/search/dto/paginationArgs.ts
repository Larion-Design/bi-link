import { ArgsType, Field, Int } from '@nestjs/graphql'

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  readonly skip: number

  @Field(() => Int, { nullable: true, defaultValue: 25 })
  readonly limit: number
}
