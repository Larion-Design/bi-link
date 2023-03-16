import { configureMicroservice } from '@app/rpc'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './appModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await configureMicroservice(app, 'Indexer', +process.env.SERVICE_INDEXER_PORT)
}

void bootstrap()
