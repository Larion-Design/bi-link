import { IngressService } from '@app/rpc/microservices/ingress'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Report } from '../dto/report'

@Resolver(() => Report)
export class GetReportTemplates {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => [Report])
  @UseGuards(FirebaseAuthGuard)
  async getReportTemplates() {
    // return this.ingressService.getReportTemplates()
    return []
  }
}
