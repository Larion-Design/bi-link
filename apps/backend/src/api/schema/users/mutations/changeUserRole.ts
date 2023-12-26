import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql';
import {
  CurrentUser,
  FirebaseAuthGuard,
  Roles,
  RolesGuard,
  UserService,
} from '@modules/iam';
import { User } from '../dto/user';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'defs';

@ArgsType()
class Params {
  @Field(() => ID)
  userId: string;

  @Field(() => String)
  role: UserRole;
}

@Resolver(() => User)
export class ChangeUserRole {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean)
  @Roles('ADMIN' as UserRole)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  async changeUserRole(
    @CurrentUser() { _id }: User,
    @Args() { userId, role }: Params,
  ) {
    await this.userService.setUserRole(userId, role);
    await this.userService.closeUserSession(userId);
    return true;
  }
}
