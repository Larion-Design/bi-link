import { FilesModule } from '@modules/files/files.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphqlInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { ApiModule } from '@modules/api';
import { CacheModule } from '@modules/cache';
import { CentralModule } from '@modules/central';
import { GraphModule } from '@modules/graph';
import { IamModule } from '@modules/iam';
import { SearchModule } from '@modules/search';

@Module({
  imports: [
    ApiModule,
    CentralModule,
    GraphModule,
    IamModule,
    SearchModule,
    CacheModule,
    FilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          uri: configService.getOrThrow<string>('MONGODB_URI'),
        }),
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const environment = configService.getOrThrow<string>(
          'NODE_ENV',
          'development',
        );
        return Promise.resolve({
          dsn: configService.get<string>('SENTRY_DSN'),
          debug: false,
          enabled: environment === 'production',
          environment: environment,
          release: configService.getOrThrow<string>('APP_VERSION'),
          logLevel: 'debug',
        });
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
  ],
})
export class AppModule {}
