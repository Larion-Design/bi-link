import { FilesService } from '@app/entities/services/filesService'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { File } from '../dto/file'

@ArgsType()
class Params {
  @Field(() => [String])
  filesIds: string[]
}

@Resolver(() => File)
export class GetFilesInfo {
  constructor(private readonly filesService: FilesService) {}

  @Query(() => [File])
  @UseGuards(FirebaseAuthGuard)
  async getFilesInfo(@Args() { filesIds }: Params) {
    return this.filesService.getFiles(filesIds)
  }
}
