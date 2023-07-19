import { RpcModule } from '@app/rpc'
import { Module } from '@nestjs/common'
import { TermeneCacheModule } from '../cache'
import { ExtractorModule } from '../extractor'
import { SchedulerModule } from '../scheduler'
import { ImportCompany } from './controllers/importCompany'
import { ImportPersonCompanies } from './controllers/importPersonCompanies'
import { SearchCompaniesByName } from './controllers/searchCompaniesByName'
import { SearchPersonsByName } from './controllers/searchPersonsByName'
import { SearchProceedings } from './controllers/searchProceedings'

@Module({
  imports: [RpcModule, ExtractorModule, TermeneCacheModule, SchedulerModule],
  providers: [
    SearchCompaniesByName,
    SearchPersonsByName,
    SearchProceedings,
    ImportPersonCompanies,
    ImportCompany,
  ],
  controllers: [
    SearchCompaniesByName,
    SearchPersonsByName,
    SearchProceedings,
    ImportPersonCompanies,
    ImportCompany,
  ],
})
export class TermeneRPCModule {}
