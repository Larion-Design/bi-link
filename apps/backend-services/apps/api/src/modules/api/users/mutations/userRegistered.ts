import { Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from '../dto/user'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { UserService } from '../../../users/services/UserService'
import { Role } from '../../../users/constants'

@Resolver(() => User)
export class UserRegistered {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async userRegistered(@CurrentUser() { _id }: User) {
    await this.userService.setUserRole(_id, Role.OPERATOR)
    return true
  }
}
