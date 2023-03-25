import { Test, TestingModule } from '@nestjs/testing';
import { FilesParserController } from './files-parser.controller';
import { FilesParserService } from './files-parser.service';

describe('FilesParserController', () => {
  let filesParserController: FilesParserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FilesParserController],
      providers: [FilesParserService],
    }).compile();

    filesParserController = app.get<FilesParserController>(FilesParserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(filesParserController.getHello()).toBe('Hello World!');
    });
  });
});
