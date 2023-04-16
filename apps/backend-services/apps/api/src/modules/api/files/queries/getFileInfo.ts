import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { File } from '../dto/file'

@ArgsType()
class Params {
  @Field(() => ID)
  fileId: string
}

@Resolver(() => File)
export class GetFileInfo {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => File)
  @UseGuards(FirebaseAuthGuard)
  async getFileInfo(@CurrentUser() { _id }: User, @Args() { fileId }: Params) {
    return this.ingressService.getEntity(
      {
        entityId: fileId,
        entityType: 'FILE',
      },
      false,
      {
        sourceId: _id,
        type: 'USER',
      },
    )
  }
}
