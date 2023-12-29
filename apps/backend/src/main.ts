import 'tslib'
import 'tsconfig-paths/register'

import compression from 'compression'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(compression())
  await app.listen(4000)
}
void bootstrap()
