import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesParserService {
  getHello(): string {
    return 'Hello World!';
  }
}
