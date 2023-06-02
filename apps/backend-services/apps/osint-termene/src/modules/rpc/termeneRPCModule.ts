import { Module } from '@nestjs/common'
import { ExtractorModule } from '../extractor'
import { SchedulerModule } from '../scheduler/schedulerModule'
import { ImportCompany } from './controllers/importCompany'
import { SearchCompanyByCUI } from './controllers/searchCompanyByCUI'

@Module({
  imports: [ExtractorModule, SchedulerModule],
  providers: [SearchCompanyByCUI, ImportCompany],
  controllers: [SearchCompanyByCUI],
})
export class TermeneRPCModule {}
