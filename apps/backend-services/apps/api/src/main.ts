import 'tsconfig-paths/register'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './appModule'
import { SentryService } from '@ntegral/nestjs-sentry'
import { Logger } from '@nestjs/common'
import { RedisOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.connectMicroservice<RedisOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      retryDelay: 2000,
      retryAttempts: 100,
    },
  })

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

  await app.startAllMicroservices()
  await app.listen(process.env.SERVICE_API_PORT, '0.0.0.0')
  Logger.log('API service is now running.')
}
void bootstrap()
