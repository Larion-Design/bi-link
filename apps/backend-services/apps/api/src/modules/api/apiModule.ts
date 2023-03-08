import { FilesModule } from '@app/files'
import { GraphModule } from '@app/graph-module'
import { RpcModule } from '@app/rpc'
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { SearchModule } from '../search/searchModule'
import { UsersModule } from '../users/UsersModule'
import { GetEntitiesGraph } from './common/queries/getEntitiesGraph'
import { GetLocations } from './common/queries/getLocations'
import { LocationAPIService } from './common/services/locationAPIService'
import { CreateCompany } from './companies/mutations/createCompany'
import { UpdateCompany } from './companies/mutations/updateCompany'
import { CompanyCUIExists } from './companies/queries/companyCUIExists'
import { CompanyRegistrationNumberExists } from './companies/queries/companyRegistrationNumberExists'
import { GetCompanies } from './companies/queries/getCompanies'
import { GetCompany } from './companies/queries/getCompany'
import { GetCompanyFrequentCustomFields } from './companies/queries/getCompanyFrequentCustomFields'
import { SearchCompanies } from './companies/queries/searchCompanies'
import { AssociatesService } from './companies/services/associatesService'
import { CompanyAPIService } from './companies/services/companyAPIService'
import { CustomFieldsService } from './customFields/services/customFieldsService'
import { FileUploadController } from './files/controllers/fileUploadController'
import { FileUrl } from './files/fieldResolvers'
import { GetFileContent } from './files/queries/getFileContent'
import { GetFileInfo } from './files/queries/getFileInfo'
import { GetFilesInfo } from './files/queries/getFilesInfo'
import { FileAPIService } from './files/services/fileAPIService'
import { CreateEvent } from './events/mutations/createEvent'
import { UpdateEvent } from './events/mutations/updateEvent'
import { GetEvent } from './events/queries/getEvent'
import { GetEventFrequentCustomFields } from './events/queries/getEventFrequentCustomFields'
import { GetEvents } from './events/queries/getEvents'
import { SearchEvents } from './events/queries/searchEvents'
import { EventAPIService } from './events/services/eventAPIService'
import { PartyAPIService } from './events/services/partyAPIService'
import { CreatePerson } from './persons/mutations/createPerson'
import { UpdatePerson } from './persons/mutations/updatePerson'
import { GetPerson } from './persons/queries/getPerson'
import { GetPersonFrequentCustomFields } from './persons/queries/getPersonFrequentCustomFields'
import { GetPersons } from './persons/queries/getPersons'
import { PersonCNPExists } from './persons/queries/personCNPExists'
import { PersonIdDocumentExists } from './persons/queries/personIdDocumentExists'
import { SearchPersons } from './persons/queries/searchPersons'
import { PersonAPIService } from './persons/services/personAPIService'
import { RelationshipsAPIService } from './persons/services/relationshipsAPIService'
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
import { PropertyAPIService } from './properties/services/propertyAPIService'
import { PropertyOwnerAPIService } from './properties/services/propertyOwnerAPIService'
import { CreateReport } from './reports/mutations/createReport'
import { UpdateReport } from './reports/mutations/updateReport'
import { GetReport } from './reports/queries/getReport'
import { GetReports } from './reports/queries/getReports'
import { GetReportTemplates } from './reports/queries/getReportTemplates'
import { ReportAPIService } from './reports/services/reportAPIService'
import { ReportContentAPIService } from './reports/services/reportContentAPIService'
import { ReportRefsAPIService } from './reports/services/reportRefsAPIService'
import { ChangeUserRole } from './users/mutations/changeUserRole'
import { DisableUser } from './users/mutations/disableUser'
import { UserRegistered } from './users/mutations/userRegistered'
import { GetUsers } from './users/queries/getUsers'

@Module({
  imports: [
    RpcModule,
    SearchModule,
    UsersModule,
    FilesModule,
    GraphModule,
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 10000000,
      },
    }),
  ],
  providers: [
    /* Service classes */
    CustomFieldsService,
    PersonAPIService,
    RelationshipsAPIService,
    FileAPIService,
    CompanyAPIService,
    LocationAPIService,
    AssociatesService,
    EventAPIService,
    PartyAPIService,
    PropertyAPIService,
    PropertyOwnerAPIService,
    ReportAPIService,
    ReportContentAPIService,
    ReportRefsAPIService,

    /* Resolvers */
    GetEntitiesGraph,
    GetCompany,
    GetCompanies,
    CreateCompany,
    UpdateCompany,
    SearchCompanies,
    CompanyCUIExists,
    CompanyRegistrationNumberExists,
    GetCompanyFrequentCustomFields,
    GetPerson,
    GetPersons,
    SearchPersons,
    CreatePerson,
    UpdatePerson,
    PersonCNPExists,
    PersonIdDocumentExists,
    GetPersonFrequentCustomFields,
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
    GetEventFrequentCustomFields,
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
  ],
  controllers: [FileUploadController],
})
export class ApiModule {}
