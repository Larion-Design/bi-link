import { BrowserPageService } from '@app/browser-module/browserPageService'
import { BrowserService } from '@app/browser-module/browserService'
import { PersistentCookiesService } from '@app/browser-module/persistentCookiesService'
import { CacheModule } from '@app/cache'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  imports: [CacheModule],
  providers: [BrowserService, BrowserPageService, PersistentCookiesService],
  exports: [BrowserService, BrowserPageService, PersistentCookiesService],
})
export class BrowserModule {}
