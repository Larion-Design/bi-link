import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { RpcModule } from '@app/rpc'
import { UsersModule } from '../users/UsersModule'
import { GetEntitiesGraph } from './graph/queries/getEntitiesGraph'
import { GetLocations } from './geolocation/queries/getLocations'
import { CreateCompany } from './companies/mutations/createCompany'
import { UpdateCompany } from './companies/mutations/updateCompany'
import { CompanyCUIExists } from './companies/queries/companyCUIExists'
import { CompanyRegistrationNumberExists } from './companies/queries/companyRegistrationNumberExists'
import { GetCompanies } from './companies/queries/getCompanies'
import { GetCompany } from './companies/queries/getCompany'
import { SearchCompanies } from './companies/queries/searchCompanies'
import { FileUploadController } from './files/controllers/fileUploadController'
import { FileUrl } from './files/fieldResolvers'
import { GetFileContent } from './files/queries/getFileContent'
import { GetFileInfo } from './files/queries/getFileInfo'
import { GetFilesInfo } from './files/queries/getFilesInfo'
import { CreateEvent } from './events/mutations/createEvent'
import { UpdateEvent } from './events/mutations/updateEvent'
import { GetEvent } from './events/queries/getEvent'
import { GetEvents } from './events/queries/getEvents'
import { SearchEvents } from './events/queries/searchEvents'
import { ImportTermeneCompany } from './integrations/termene/mutations/importTermeneCompany'
import { ImportTermenePersonCompanies } from './integrations/termene/mutations/importTermenePersonCompanies'
import { SearchTermeneCompanies } from './integrations/termene/queries/searchTermeneCompanies'
import { SearchTermenePersons } from './integrations/termene/queries/searchTermenePersons'
import { CreatePerson } from './persons/mutations/createPerson'
import { UpdatePerson } from './persons/mutations/updatePerson'
import { GetPerson } from './persons/queries/getPerson'
import { GetPersons } from './persons/queries/getPersons'
import { PersonCNPExists } from './persons/queries/personCNPExists'
import { PersonIdDocumentExists } from './persons/queries/personIdDocumentExists'
import { SearchPersons } from './persons/queries/searchPersons'
import { CreateProceeding } from './proceedings/mutations/createProceeding'
import { UpdateProceeding } from './proceedings/mutations/updateProceeding'
import { GetProceeding } from './proceedings/queries/getProceeding'
import { GetProceedings } from './proceedings/queries/getProceedings'
import { SearchProceedings } from './proceedings/queries/searchProceedings'
import { CreateProperty } from './properties/mutations/createProperty'
import { UpdateProperty } from './properties/mutations/updateProperty'
import { GetProperties } from './properties/queries/getProperties'
import { GetPropertiesByCompany } from './properties/queries/getPropertiesByCompany'
import { GetPropertiesByPerson } from './properties/queries/getPropertiesByPerson'
import { GetProperty } from './properties/queries/getProperty'
import { SearchProperties } from './properties/queries/searchProperties'
import { GetMakers } from './properties/queries/vehicles/getMakers'
import { GetModels } from './properties/queries/vehicles/getModels'
import { VinExists } from './properties/queries/vehicles/vinExists'
import { CreateReport } from './reports/mutations/createReport'
import { UpdateReport } from './reports/mutations/updateReport'
import { GetReport } from './reports/queries/getReport'
import { GetReports } from './reports/queries/getReports'
import { GetReportTemplates } from './reports/queries/getReportTemplates'
import { ChangeUserRole } from './users/mutations/changeUserRole'
import { DisableUser } from './users/mutations/disableUser'
import { UserRegistered } from './users/mutations/userRegistered'
import { GetUsers } from './users/queries/getUsers'

@Module({
  imports: [
    RpcModule,
    UsersModule,
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 10000000,
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
