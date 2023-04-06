import { configureMicroservice } from '@app/rpc'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './appModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.SERVICE_INGRESS_PORT
  await configureMicroservice(app, 'Ingress', port ? +port : undefined)
}

void bootstrap()
