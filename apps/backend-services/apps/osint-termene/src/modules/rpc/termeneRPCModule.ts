import { RpcModule } from '@app/rpc'
import { Module } from '@nestjs/common'
import { ExtractorModule } from '../extractor'
import { SchedulerModule } from '../scheduler'
import { ImportCompany } from './controllers/importCompany'
import { ImportPersonCompanies } from './controllers/importPersonCompanies'
import { SearchCompaniesByName } from './controllers/searchCompaniesByName'
import { SearchCompanyByCUI } from './controllers/searchCompanyByCUI'
import { SearchPersonsByName } from './controllers/searchPersonsByName'
import { SearchProceedings } from './controllers/searchProceedings'

@Module({
  imports: [RpcModule, ExtractorModule, SchedulerModule],
  providers: [
    SearchCompanyByCUI,
    SearchCompaniesByName,
    SearchPersonsByName,
    SearchProceedings,
    ImportPersonCompanies,
    ImportCompany,
  ],
  controllers: [
    SearchCompanyByCUI,
    SearchCompaniesByName,
    SearchPersonsByName,
    SearchProceedings,
    ImportPersonCompanies,
    ImportCompany,
  ],
})
export class TermeneRPCModule {}
