import { configureMicroservice } from '@app/rpc'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './appModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await configureMicroservice(app, 'Ingress', +process.env.SERVICE_INGRESS_PORT)
}

void bootstrap()
