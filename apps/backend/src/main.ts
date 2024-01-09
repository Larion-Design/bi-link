import 'tslib'
import 'tsconfig-paths/register'

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    app.enableCors({ origin: true })
    app.enableShutdownHooks()
    await app.listen(44023)
  } catch (e) {
    console.error(e)
  }
}
void bootstrap()
