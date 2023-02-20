import { Module } from '@nestjs/common'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServiceHealthModule } from '@app/service-health'
import { SearchToolsModule } from '@app/search-tools-module'
import { UserActionController } from './controllers/userActionController'
import { HistoryIndexerService } from './services/historyIndexerService'
import { HistoryMappingService } from './services/historyMappingService'

@Module({
  imports: [
    SearchToolsModule,
    ServiceHealthModule,
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
  providers: [HistoryIndexerService, HistoryMappingService],
})
export class AppModule {}
