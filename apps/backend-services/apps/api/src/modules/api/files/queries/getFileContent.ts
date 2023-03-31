import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { File } from '../dto/file'

@ArgsType()
class Params {
  @Field(() => ID)
  fileId: string
}

@Resolver(() => File)
export class GetFileContent {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => String, { nullable: true })
  @UseGuards(FirebaseAuthGuard)
  async getFileContent(@Args() { fileId }: Params) {
    return this.indexerService.getFileContent(fileId)
  }
}
