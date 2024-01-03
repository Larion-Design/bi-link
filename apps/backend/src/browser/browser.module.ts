import { CacheModule } from '@modules/cache'
import { BrowserPageService } from './browserPageService'
import { BrowserService } from './browserService'
import { PersistentCookiesService } from './persistentCookiesService'
import { Global, Module, Provider } from '@nestjs/common'

const providers: Provider[] = [BrowserService, BrowserPageService, PersistentCookiesService]

@Global()
@Module({
  imports: [CacheModule],
  providers,
  exports: providers,
})
export class BrowserModule {}
