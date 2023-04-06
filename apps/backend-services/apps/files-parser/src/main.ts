import { configureMicroservice } from '@app/rpc'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './appModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.SERVICE_FILES_PARSER_PORT
  await configureMicroservice(app, 'FilesParser', port ? +port : undefined)
}

void bootstrap()
