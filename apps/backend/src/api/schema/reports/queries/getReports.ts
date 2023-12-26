import { UseGuards } from '@nestjs/common';
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql';
import { ReportsService } from '@modules/central/schema/report/services/reportsService';
import { EntityType, User } from 'defs';
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam';
import { Report } from '../dto/report';

@ArgsType()
class Params {
  @Field(() => ID)
  entityId: string;

  @Field(() => String)
  entityType: EntityType;
}

@Resolver(() => Report)
export class GetReports {
  constructor(private readonly ingressService: ReportsService) {}

  @Query(() => [Report])
  @UseGuards(FirebaseAuthGuard)
  async getReports(
    @CurrentUser() { _id }: User,
    @Args() { entityId, entityType }: Params,
  ) {
    return this.ingressService.getEntityReports({ entityId, entityType });
  }
}
