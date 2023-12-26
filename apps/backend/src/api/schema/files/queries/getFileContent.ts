import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '@modules/iam';
import { SearchFilesService } from '@modules/search/services/search';
import { File } from '../dto/file';

@ArgsType()
class Params {
  @Field(() => ID)
  fileId: string;
}

@Resolver(() => File)
export class GetFileContent {
  constructor(private readonly indexerService: SearchFilesService) {}

  @Query(() => String, { nullable: true })
  @UseGuards(FirebaseAuthGuard)
  async getFileContent(@Args() { fileId }: Params) {
    return this.indexerService.getFileContent(fileId);
  }
}
