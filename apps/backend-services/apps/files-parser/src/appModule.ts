import { CacheModule, Module } from '@nestjs/common'
import { ServiceHealthModule } from '@app/service-health'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ProcessFileController } from './controllers/processFileController'
import { ParserService } from './services/parserService'
import { FilesModule } from '@app/files'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    ServiceHealthModule,
    FilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      cache: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          uri: configService.get<string>('MONGODB_URI'),
        }),
    }),
  ],
  controllers: [ProcessFileController],
  providers: [ParserService],
})
export class AppModule {}
