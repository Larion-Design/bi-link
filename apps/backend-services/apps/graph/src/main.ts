import { configureMicroservice } from '@app/rpc'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './appModule'
import { SentryService } from '@ntegral/nestjs-sentry'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  configureMicroservice(app)

  const logger = SentryService.SentryServiceInstance()
  logger.setContext('Graph')
  logger.setLogLevels(
    process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['warn', 'error', 'debug'],
  )
  app.useLogger(logger)

  await app.startAllMicroservices()
  await app.listen(process.env.SERVICE_GRAPH_PORT)
  Logger.log('Graph service is now running.')
}

void bootstrap()
