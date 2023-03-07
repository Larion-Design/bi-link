import { NestFactory } from '@nestjs/core'
import { AppModule } from './appModule'
import { SentryService } from '@ntegral/nestjs-sentry'
import { RedisOptions, Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.connectMicroservice<RedisOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      retryDelay: 2000,
      retryAttempts: 100,
    },
  })

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
