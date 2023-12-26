import { UseGuards } from '@nestjs/common';
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql';
import { ReportsService } from '@modules/central/schema/report/services/reportsService';
import { User } from 'defs';
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam';
import { Report } from '../dto/report';

@ArgsType()
class Params {
  @Field(() => ID)
  id: string;
}

@Resolver(() => Report)
export class GetReport {
  constructor(private readonly ingressService: ReportsService) {}

  @Query(() => Report)
  @UseGuards(FirebaseAuthGuard)
  async getReport(@CurrentUser() { _id }: User, @Args() { id }: Params) {
    return this.ingressService.getReport(id, true);
  }
}
