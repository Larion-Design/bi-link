import { UseGuards } from '@nestjs/common';
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql';
import { PropertiesService } from '@modules/central/schema/property/services/propertiesService';
import { EntityInfo, UpdateSource, User } from 'defs';
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam';
import { PropertyInput } from '../dto/propertyInput';
import { Property } from '../dto/property';

@ArgsType()
class Params {
  @Field(() => ID)
  propertyId: string;

  @Field(() => PropertyInput)
  data: PropertyInput;
}

@Resolver(() => Property)
export class UpdateProperty {
  constructor(private readonly ingressService: PropertiesService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateProperty(
    @CurrentUser() { _id, role }: User,
    @Args() { propertyId, data }: Params,
  ) {
    await this.ingressService.update(propertyId, data);
    return true;
  }
}
