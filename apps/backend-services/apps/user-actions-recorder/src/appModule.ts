import { Module } from '@nestjs/common'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServiceHealthModule } from '@app/service-health'
import { SearchToolsModule } from '@app/search-tools-module'
import { MongooseModule } from '@nestjs/mongoose'
import { UserActionController } from './userActionController'

@Module({
  imports: [
    SearchToolsModule,
    ServiceHealthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          uri: configService.get<string>('MONGODB_URI'),
        }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      cache: true,
    }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          node: configService.get<string>('ELASTICSEARCH_URI'),
        }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserActionController],
})
export class AppModule {}
