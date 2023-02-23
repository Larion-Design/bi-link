import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsPositive } from 'class-validator'

@ArgsType()
export class PaginationArgs {
  @IsPositive()
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  readonly skip: number

  @IsPositive()
  @Field(() => Int, { nullable: true, defaultValue: 25 })
  readonly limit: number
}
