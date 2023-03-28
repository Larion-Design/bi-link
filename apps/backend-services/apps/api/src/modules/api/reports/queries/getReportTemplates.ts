import { ReportsService } from '@app/models/report/services/reportsService'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Report } from '../dto/report'

@Resolver(() => Report)
export class GetReportTemplates {
  constructor(private readonly reportsService: ReportsService) {}

  @Query(() => [Report])
  @UseGuards(FirebaseAuthGuard)
  async getReportTemplates() {
    return this.reportsService.getReportTemplates()
  }
}
