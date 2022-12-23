import { CommandFactory } from 'nest-commander'
import { AppModule } from './appModule'

async function bootstrap() {
  await CommandFactory.run(AppModule, ['debug', 'verbose', 'warn', 'error'])
}

void bootstrap()
