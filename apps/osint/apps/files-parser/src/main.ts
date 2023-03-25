import { NestFactory } from '@nestjs/core';
import { FilesParserModule } from './files-parser.module';

async function bootstrap() {
  const app = await NestFactory.create(FilesParserModule);
  await app.listen(3000);
}
bootstrap();
