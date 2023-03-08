import { configureMicroservice } from '@app/rpc'
import { NestFactory } from '@nestjs/core'
import { SentryService } from '@ntegral/nestjs-sentry'
import { Logger } from '@nestjs/common'
import { AppModule } from './appModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  configureMicroservice(app)

  const logger = SentryService.SentryServiceInstance()
  logger.setContext('Entities')
  logger.setLogLevels(
    process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['warn', 'error', 'debug'],
  )
  app.useLogger(logger)

  await app.startAllMicroservices()
  await app.listen(process.env.SERVICE_ENTITIES_PORT)
  Logger.log('Entities service is now running.')
}

void bootstrap()
