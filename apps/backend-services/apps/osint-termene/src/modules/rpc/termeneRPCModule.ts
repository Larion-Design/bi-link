import { Module } from '@nestjs/common'
import { GetCompanyInfoByCUI } from './controllers/getCompanyInfoByCUI'

@Module({
  providers: [GetCompanyInfoByCUI],
  controllers: [GetCompanyInfoByCUI],
})
export class TermeneRPCModule {}
