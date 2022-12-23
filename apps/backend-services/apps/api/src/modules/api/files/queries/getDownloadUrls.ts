import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { FileStorageService } from '@app/files/services/fileStorageService'
import { File } from '../dto/file'

@ArgsType()
class Params {
  @Field(() => [String])
  filesIds: string[]
}

@Resolver(() => File)
export class GetDownloadUrls {
  constructor(protected fileStorageService: FileStorageService) {}

  @Query(() => [String])
  @UseGuards(FirebaseAuthGuard)
  async getDownloadUrls(@Args() { filesIds }: Params) {
    return this.fileStorageService.getDownloadUrls(filesIds)
  }
}
