import { Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, FirebaseAuthGuard, UserService } from '@modules/iam';
import { User } from '../dto/user';

@Resolver(() => User)
export class UserRegistered {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async userRegistered(@CurrentUser() { _id }: User) {
    await this.userService.setUserRole(_id, 'OPERATOR');
    return true;
  }
}
