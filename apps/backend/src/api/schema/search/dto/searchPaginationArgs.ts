import { ArgsType, Field } from '@nestjs/graphql'
import { PaginationArgs } from './paginationArgs'

@ArgsType()
export class SearchPaginationArgs extends PaginationArgs {
  @Field()
  searchTerm: string
}
