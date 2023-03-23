import { configureMicroservice } from '@app/rpc'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './appModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await configureMicroservice(app, 'FilesParser', +process.env.SERVICE_FILES_PARSER_PORT)
}

void bootstrap()
