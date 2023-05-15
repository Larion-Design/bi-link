import { BrowserService } from '@app/browser-module/browserService'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  providers: [BrowserService],
  exports: [BrowserService],
})
export class BrowserModule {}
