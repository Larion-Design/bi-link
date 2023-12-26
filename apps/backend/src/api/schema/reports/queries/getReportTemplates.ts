import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ReportsService } from '@modules/central/schema/report/services/reportsService';
import { FirebaseAuthGuard } from '@modules/iam';
import { Report } from '../dto/report';

@Resolver(() => Report)
export class GetReportTemplates {
  constructor(private readonly ingressService: ReportsService) {}

  @Query(() => [Report])
  @UseGuards(FirebaseAuthGuard)
  async getReportTemplates() {
    return this.ingressService.getReportTemplates();
  }
}
