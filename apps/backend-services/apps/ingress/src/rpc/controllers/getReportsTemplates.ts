import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { MICROSERVICES } from '@app/rpc/constants'
import { ReportsService } from '../../entities/report/services/reportsService'

@Controller()
export class GetReportsTemplates {
  constructor(private readonly reportsService: ReportsService) {}

  @MessagePattern(MICROSERVICES.INGRESS.getReportsTemplates)
  async getReportsTemplates() {
    return this.reportsService.getReportTemplates()
  }
}
