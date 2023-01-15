import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { SearchFilesService } from '../../../search/services/searchFilesService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { File } from '../dto/file'

@ArgsType()
class Params {
  @Field()
  fileId: string
}

@Resolver(() => File)
export class GetFileContent {
  constructor(private readonly searchFilesService: SearchFilesService) {}

  @Query(() => String, { nullable: true })
  @UseGuards(FirebaseAuthGuard)
  async getFileInfo(@Args() { fileId }: Params) {
    const fileContent = await this.searchFilesService.getFileContent(fileId)
    return fileContent?.length > 0 ? fileContent : null
  }
}
