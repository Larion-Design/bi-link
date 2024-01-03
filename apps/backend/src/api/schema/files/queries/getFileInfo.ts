import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FilesService } from '@modules/central/schema/file/services/filesService'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { File } from '../dto/file'

@ArgsType()
class Params {
  @Field(() => ID)
  fileId: string
}

@Resolver(() => File)
export class GetFileInfo {
  constructor(private readonly ingressService: FilesService) {}

  @Query(() => File)
  @UseGuards(FirebaseAuthGuard)
  async getFileInfo(@CurrentUser() { _id }: User, @Args() { fileId }: Params) {
    return this.ingressService.getFile(fileId)
  }
}
