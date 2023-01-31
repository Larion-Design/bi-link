import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FilesService } from '@app/entities/services/filesService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { File } from '../dto/file'

@ArgsType()
class Params {
  @Field()
  fileId: string
}

@Resolver(() => File)
export class GetFileInfo {
  constructor(private readonly filesService: FilesService) {}

  @Query(() => File)
  @UseGuards(FirebaseAuthGuard)
  async getFileInfo(@Args() { fileId }: Params) {
    return this.filesService.getFile(fileId)
  }
}
