import { INestApplication } from '@nestjs/common'
import { RedisOptions, Transport } from '@nestjs/microservices'

export const configureMicroservice = (app: INestApplication) =>
  app.connectMicroservice<RedisOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      retryDelay: 2000,
      retryAttempts: 100,
      tls: {},
    },
  })
