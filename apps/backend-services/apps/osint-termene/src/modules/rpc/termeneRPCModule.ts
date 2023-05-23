import { Module } from '@nestjs/common'
import { ImportCompany } from './controllers/importCompany'
import { SearchCompanyByCUI } from './controllers/searchCompanyByCUI'

@Module({
  providers: [SearchCompanyByCUI, ImportCompany],
  controllers: [SearchCompanyByCUI],
})
export class TermeneRPCModule {}
