import { NestFactory } from '@nestjs/core'
import { Callback, Context, Handler } from 'aws-lambda'
import serverlessExpress from '@vendia/serverless-express'
import { ScraperTermeneModule } from './scraperTermeneModule'

let server: Handler

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(ScraperTermeneModule)
  await app.init()
  return serverlessExpress({ app: app.getHttpAdapter().getInstance() })
}

export const handler: Handler = async (event: unknown, context: Context, callback: Callback) => {
  if (!server) {
    server = await bootstrap()
  }
  return Promise.resolve(server?.(event, context, callback))
}
