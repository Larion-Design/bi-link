import { RegenerateGraph } from '@modules/api/schema/system/regenerateGraph'
import { RegenerateSearchIndex } from '@modules/api/schema/system/regenerateSearchIndex'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { CreateCompany } from './schema/companies/mutations/createCompany'
import { UpdateCompany } from './schema/companies/mutations/updateCompany'
import { CompanyCUIExists } from './schema/companies/queries/companyCUIExists'
import { CompanyRegistrationNumberExists } from './schema/companies/queries/companyRegistrationNumberExists'
import { GetCompanies } from './schema/companies/queries/getCompanies'
import { GetCompany } from './schema/companies/queries/getCompany'
import { SearchCompanies } from './schema/companies/queries/searchCompanies'
import { FileUploadController } from './schema/files/controllers/fileUploadController'
import { FileUrl } from './schema/files/fieldResolvers'
import { GetFileContent } from './schema/files/queries/getFileContent'
import { GetFileInfo } from './schema/files/queries/getFileInfo'
import { GetFilesInfo } from './schema/files/queries/getFilesInfo'
import { GetLocations } from './schema/geolocation/queries/getLocations'
import { GetEntitiesGraph } from './schema/graph/queries/getEntitiesGraph'
import { CreatePerson } from './schema/persons/mutations/createPerson'
import { UpdatePerson } from './schema/persons/mutations/updatePerson'
import { GetPerson } from './schema/persons/queries/getPerson'
import { GetPersons } from './schema/persons/queries/getPersons'
import { PersonCNPExists } from './schema/persons/queries/personCNPExists'
import { PersonIdDocumentExists } from './schema/persons/queries/personIdDocumentExists'
import { SearchPersons } from './schema/persons/queries/searchPersons'

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 10000000,
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        const isProd = configService.get<string>('NODE_ENV', 'development') === 'production'
        return Promise.resolve({
          debug: !isProd,
          autoTransformHttpErrors: true,
          allowBatchedHttpRequests: true,
          stopOnTerminationSignals: true,
          csrfPrevention: true,
          cache: 'bounded',
          playground: !isProd,
          autoSchemaFile: true,
          sortSchema: true,
          cors: true,
          persistedQueries: {
            ttl: null,
          },
          introspection: !isProd,
          credentials: true,
          buildSchemaOptions: {
            noDuplicatedFields: true,
          },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          context: ({ req }) => ({ req }),
        })
      },
    }),
  ],
  providers: [
    GetEntitiesGraph,
    GetCompany,
    GetCompanies,
    CreateCompany,
    UpdateCompany,
    SearchCompanies,
    CompanyCUIExists,
    CompanyRegistrationNumberExists,
    GetPerson,
    GetPersons,
    SearchPersons,
    CreatePerson,
    UpdatePerson,
    PersonCNPExists,
    PersonIdDocumentExists,
    FileUrl,
    RegenerateSearchIndex,
    RegenerateGraph,
    GetFileInfo,
    GetFilesInfo,
    GetFileContent,
    GetLocations,
  ],
  controllers: [FileUploadController],
})
export class ApiModule {}
