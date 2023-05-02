import { NestFactory } from '@nestjs/core'
import { ScraperTermeneModule } from './scraperTermeneModule'

async function bootstrap() {
  const app = await NestFactory.create(ScraperTermeneModule)
  await app.listen(3000)
}

void bootstrap()
