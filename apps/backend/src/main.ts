import * as compression from 'compression'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(compression())
  app.enableCors({ origin: true })
  app.enableShutdownHooks()
  await app.listen(44023)
}
void bootstrap()
