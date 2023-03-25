import { Controller, Get } from '@nestjs/common';
import { FilesParserService } from './files-parser.service';

@Controller()
export class FilesParserController {
  constructor(private readonly filesParserService: FilesParserService) {}

  @Get()
  getHello(): string {
    return this.filesParserService.getHello();
  }
}
