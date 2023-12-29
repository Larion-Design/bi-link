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
import { CreateEvent } from './schema/events/mutations/createEvent'
import { UpdateEvent } from './schema/events/mutations/updateEvent'
import { GetEvent } from './schema/events/queries/getEvent'
import { GetEvents } from './schema/events/queries/getEvents'
import { SearchEvents } from './schema/events/queries/searchEvents'
import { FileUploadController } from './schema/files/controllers/fileUploadController'
import { FileUrl } from './schema/files/fieldResolvers'
import { GetFileContent } from './schema/files/queries/getFileContent'
import { GetFileInfo } from './schema/files/queries/getFileInfo'
import { GetFilesInfo } from './schema/files/queries/getFilesInfo'
import { GetLocations } from './schema/geolocation/queries/getLocations'
import { GetEntitiesGraph } from './schema/graph/queries/getEntitiesGraph'
import { ImportTermeneCompany } from './schema/integrations/termene/mutations/importTermeneCompany'
import { ImportTermenePersonCompanies } from './schema/integrations/termene/mutations/importTermenePersonCompanies'
import { SearchTermeneCompanies } from './schema/integrations/termene/queries/searchTermeneCompanies'
import { SearchTermenePersons } from './schema/integrations/termene/queries/searchTermenePersons'
import { CreatePerson } from './schema/persons/mutations/createPerson'
import { UpdatePerson } from './schema/persons/mutations/updatePerson'
import { GetPerson } from './schema/persons/queries/getPerson'
import { GetPersons } from './schema/persons/queries/getPersons'
import { PersonCNPExists } from './schema/persons/queries/personCNPExists'
import { PersonIdDocumentExists } from './schema/persons/queries/personIdDocumentExists'
import { SearchPersons } from './schema/persons/queries/searchPersons'
import { CreateProceeding } from './schema/proceedings/mutations/createProceeding'
import { UpdateProceeding } from './schema/proceedings/mutations/updateProceeding'
import { GetProceeding } from './schema/proceedings/queries/getProceeding'
import { GetProceedings } from './schema/proceedings/queries/getProceedings'
import { SearchProceedings } from './schema/proceedings/queries/searchProceedings'
import { CreateProperty } from './schema/properties/mutations/createProperty'
import { UpdateProperty } from './schema/properties/mutations/updateProperty'
import { GetProperties } from './schema/properties/queries/getProperties'
import { GetPropertiesByCompany } from './schema/properties/queries/getPropertiesByCompany'
import { GetPropertiesByPerson } from './schema/properties/queries/getPropertiesByPerson'
import { GetProperty } from './schema/properties/queries/getProperty'
import { SearchProperties } from './schema/properties/queries/searchProperties'
import { GetMakers } from './schema/properties/queries/vehicles/getMakers'
import { GetModels } from './schema/properties/queries/vehicles/getModels'
import { VinExists } from './schema/properties/queries/vehicles/vinExists'
import { CreateReport } from './schema/reports/mutations/createReport'
import { UpdateReport } from './schema/reports/mutations/updateReport'
import { GetReport } from './schema/reports/queries/getReport'
import { GetReports } from './schema/reports/queries/getReports'
import { GetReportTemplates } from './schema/reports/queries/getReportTemplates'
import { ChangeUserRole } from './schema/users/mutations/changeUserRole'
import { DisableUser } from './schema/users/mutations/disableUser'
import { UserRegistered } from './schema/users/mutations/userRegistered'
import { GetUsers } from './schema/users/queries/getUsers'

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
    GetMakers,
    GetModels,
    VinExists,
    SearchProperties,
    GetProperties,
    GetProperty,
    CreateProperty,
    UpdateProperty,
    GetPropertiesByPerson,
    GetPropertiesByCompany,
    UserRegistered,
    GetEvent,
    SearchEvents,
    CreateEvent,
    UpdateEvent,
    GetEvents,
    GetUsers,
    ChangeUserRole,
    DisableUser,
    GetReport,
    GetReports,
    GetReportTemplates,
    CreateReport,
    UpdateReport,
    GetFileInfo,
    GetFilesInfo,
    GetFileContent,
    GetLocations,
    GetProceeding,
    GetProceedings,
    CreateProceeding,
    UpdateProceeding,
    SearchProceedings,
    SearchTermeneCompanies,
    SearchTermenePersons,
    ImportTermeneCompany,
    ImportTermenePersonCompanies,
  ],
  controllers: [FileUploadController],
})
export class ApiModule {}
