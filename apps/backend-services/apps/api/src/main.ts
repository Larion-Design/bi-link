import 'tsconfig-paths/register'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './appModule'
import { SentryService } from '@ntegral/nestjs-sentry'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  )

  const logger = SentryService.SentryServiceInstance()
  logger.setContext('API')
  logger.setLogLevels(
    process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['warn', 'error', 'debug'],
  )
  app.useLogger(logger)
  app.enableCors()

  await app.startAllMicroservices()
  await app.listen(process.env.SERVICE_API_PORT ?? 80, '0.0.0.0')
  Logger.log('API service is now running.')
}
void bootstrap()
