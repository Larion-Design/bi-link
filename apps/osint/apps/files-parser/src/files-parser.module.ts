import { Module } from '@nestjs/common';
import { FilesParserController } from './files-parser.controller';
import { FilesParserService } from './files-parser.service';

@Module({
  imports: [],
  controllers: [FilesParserController],
  providers: [FilesParserService],
})
export class FilesParserModule {}
