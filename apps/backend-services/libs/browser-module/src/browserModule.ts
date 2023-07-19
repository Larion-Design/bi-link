import { BrowserPageService } from '@app/browser-module/browserPageService'
import { BrowserService } from '@app/browser-module/browserService'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  providers: [BrowserService, BrowserPageService],
  exports: [BrowserService, BrowserPageService],
})
export class BrowserModule {}
