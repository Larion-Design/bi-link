import { configureMicroservice } from '@app/rpc'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './appModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.SERVICE_OSINT_TERMENE_PORT
  await configureMicroservice(app, 'Termene', port ? +port : undefined)
}

void bootstrap()
