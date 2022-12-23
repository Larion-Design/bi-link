import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { User } from '../dto/user'
import { UserService } from '../../../users/services/UserService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { Role } from '../../../users/constants'
import { RolesGuard } from '../../../users/guards/RolesGuard'
import { Roles } from '../../../users/decorators/roles'

@ArgsType()
class Params {
  @Field()
  userId: string

  @Field(() => String)
  role: Role
}

@Resolver(() => User)
export class ChangeUserRole {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  async changeUserRole(@CurrentUser() { _id }: User, @Args() { userId, role }: Params) {
    await this.userService.setUserRole(userId, role)
    await this.userService.closeUserSession(userId)
    return true
  }
}
