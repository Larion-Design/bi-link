import { Query, Resolver } from '@nestjs/graphql'
import { UserRole } from 'defs'
import { User } from '../dto/user'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserService } from '../../../users/services/UserService'
import { RolesGuard } from '../../../users/guards/RolesGuard'
import { Roles } from '../../../users/decorators/roles'

@Resolver(() => User)
export class GetUsers {
  constructor(private readonly usersService: UserService) {}

  @Query(() => [User])
  @Roles('ADMIN')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  async getUsers(): Promise<User[] | undefined> {
    const users = await this.usersService.getAllUsers()

    if (users) {
      return users.map(({ uid, disabled, displayName, email, customClaims }) => {
        const user = new User()
        user._id = uid
        user.name = displayName ?? ''
        user.active = disabled
        user.email = email ?? ''
        user.role = customClaims?.role
        return user
      })
    }
  }
}
