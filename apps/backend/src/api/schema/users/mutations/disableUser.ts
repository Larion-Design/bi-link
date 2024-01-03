import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser, FirebaseAuthGuard, Roles, RolesGuard, UserService } from '@modules/iam'
import { User } from '../dto/user'
import { UseGuards } from '@nestjs/common'

@ArgsType()
class Params {
  @Field(() => ID)
  userId: string
}

@Resolver(() => User)
export class DisableUser {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean)
  @Roles('ADMIN')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  async disableUser(@CurrentUser() { _id }: User, @Args() { userId }: Params) {
    await this.userService.closeUserSession(userId)
    await this.userService.disableUser(userId)
    return true
  }
}
