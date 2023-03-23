import { configureMicroservice } from '@app/rpc'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './appModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await configureMicroservice(app, 'UserActions', +process.env.SERVICE_USER_ACTIONS_PORT ?? 80)
}

void bootstrap()
