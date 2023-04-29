import { INestApplication, Logger } from '@nestjs/common'
import { NatsOptions, Transport } from '@nestjs/microservices'
import { SentryService } from '@ntegral/nestjs-sentry'

export const configureMicroservice = async (
  app: INestApplication,
  serviceName: string,
  port?: number,
) => {
  app.connectMicroservice<NatsOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URI as string],
      retryDelay: 2000,
      retryAttempts: 100,
    },
  })

  const logger = SentryService.SentryServiceInstance()
  logger.setContext(serviceName)
  logger.setLogLevels(
    process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['warn', 'error', 'debug'],
  )
  app.useLogger(logger)

  await app.startAllMicroservices()
  await app.listen(port ?? 80, '0.0.0.0')
  Logger.log(`${serviceName} service is now running.`)
  return app
}
