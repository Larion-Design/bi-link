import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { File } from '../dto/file'

@ArgsType()
class Params {
  @Field(() => [String])
  filesIds: string[]
}

@Resolver(() => File)
export class GetFilesInfo {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => [File])
  @UseGuards(FirebaseAuthGuard)
  async getFilesInfo(@CurrentUser() { _id }: User, @Args() { filesIds }: Params) {
    return this.ingressService.getEntities(filesIds, 'FILE', false, {
      sourceId: _id,
      type: 'USER',
    })
  }
}
