import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { UserRole } from 'defs'
import { User } from '../dto/user'
import { UserService } from '../../../users/services/UserService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { RolesGuard } from '../../../users/guards/RolesGuard'
import { Roles } from '../../../users/decorators/roles'

@ArgsType()
class Params {
  @Field()
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
