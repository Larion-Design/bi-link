import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { DownloadUrl } from '../dto/downloadUrl'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { FileStorageService } from '@app/files/services/fileStorageService'

@ArgsType()
class Params {
  @Field()
  objectId: string
}

@Resolver(() => DownloadUrl)
export class GetDownloadUrl {
  constructor(protected fileStorageService: FileStorageService) {}

  @Query(() => DownloadUrl)
  @UseGuards(FirebaseAuthGuard)
  async getDownloadUrl(@Args() { objectId }: Params) {
    return this.fileStorageService.getDownloadUrl(objectId)
  }
}
