import { FilesService } from '@app/entities/services/filesService'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { File } from '../dto/file'

@ArgsType()
class Params {
  @Field()
  filesId: string
}

@Resolver(() => File)
export class GetFileInfo {
  constructor(protected filesService: FilesService) {}

  @Query(() => [File])
  @UseGuards(FirebaseAuthGuard)
  async getFileInfo(@Args() { filesId }: Params) {
    return this.filesService.getFile(filesId)
  }
}
