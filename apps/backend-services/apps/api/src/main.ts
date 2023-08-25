import 'tsconfig-paths/register'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import compression from 'compression'
import { AppModule } from './appModule'
import { SentryService } from '@ntegral/nestjs-sentry'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const logger = SentryService.SentryServiceInstance()
  logger.setContext('API')
  logger.setLogLevels(
    process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['warn', 'error', 'debug'],
  )

  const app = await NestFactory.create(AppModule)
  app.use(helmet({ contentSecurityPolicy: false }))
  app.useLogger(logger)
  app.enableCors()
  app.use(compression())

  await app.startAllMicroservices()
  await app.listen(process.env.SERVICE_API_PORT ?? 80, '0.0.0.0')
  Logger.log('API service is now running.')
}
void bootstrap()
