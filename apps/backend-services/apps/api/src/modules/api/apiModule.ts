import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { RpcModule } from '@app/rpc'
import { UsersModule } from '../users/UsersModule'
import { GetEntitiesGraph } from './graph/queries/getEntitiesGraph'
import { GetLocations } from './geolocation/queries/getLocations'
import { LocationAPIService } from '../../../../ingress/src/entities/location/services/locationAPIService'
import { CreateCompany } from './companies/mutations/createCompany'
import { UpdateCompany } from './companies/mutations/updateCompany'
import { CompanyCUIExists } from './companies/queries/companyCUIExists'
import { CompanyRegistrationNumberExists } from './companies/queries/companyRegistrationNumberExists'
import { GetCompanies } from './companies/queries/getCompanies'
import { GetCompany } from './companies/queries/getCompany'
import { SearchCompanies } from './companies/queries/searchCompanies'
import { AssociatesService } from '../../../../ingress/src/entities/company/services/associatesService'
import { CompanyAPIService } from '../../../../ingress/src/entities/company/services/companyAPIService'
import { CustomFieldsService } from '../../../../ingress/src/entities/customField/services/customFieldsService'
import { FileUploadController } from './files/controllers/fileUploadController'
import { FileUrl } from './files/fieldResolvers'
import { GetFileContent } from './files/queries/getFileContent'
import { GetFileInfo } from './files/queries/getFileInfo'
import { GetFilesInfo } from './files/queries/getFilesInfo'
import { FileAPIService } from '../../../../ingress/src/entities/file/services/fileAPIService'
import { CreateEvent } from './events/mutations/createEvent'
import { UpdateEvent } from './events/mutations/updateEvent'
import { GetEvent } from './events/queries/getEvent'
import { GetEvents } from './events/queries/getEvents'
import { SearchEvents } from './events/queries/searchEvents'
import { EventAPIService } from '../../../../ingress/src/entities/event/services/eventAPIService'
import { PartyAPIService } from '../../../../ingress/src/entities/event/services/partyAPIService'
import { CreatePerson } from './persons/mutations/createPerson'
import { UpdatePerson } from './persons/mutations/updatePerson'
import { GetPerson } from './persons/queries/getPerson'
import { GetPersons } from './persons/queries/getPersons'
import { PersonCNPExists } from './persons/queries/personCNPExists'
import { PersonIdDocumentExists } from './persons/queries/personIdDocumentExists'
import { SearchPersons } from './persons/queries/searchPersons'
import { PersonAPIService } from '../../../../ingress/src/entities/person/services/personAPIService'
import { RelationshipsAPIService } from '../../../../ingress/src/entities/person/services/relationshipsAPIService'
import { CreateProceeding } from './proceedings/mutations/createProceeding'
import { UpdateProceeding } from './proceedings/mutations/updateProceeding'
import { GetProceeding } from './proceedings/queries/getProceeding'
import { GetProceedings } from './proceedings/queries/getProceedings'
import { SearchProceedings } from './proceedings/queries/searchProceedings'
import { ProceedingAPIService } from '../../../../ingress/src/entities/proceeding/services/proceedingAPIService'
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
import { PropertyAPIService } from '../../../../ingress/src/entities/property/services/propertyAPIService'
import { PropertyOwnerAPIService } from '../../../../ingress/src/entities/property/services/propertyOwnerAPIService'
import { CreateReport } from './reports/mutations/createReport'
import { UpdateReport } from './reports/mutations/updateReport'
import { GetReport } from './reports/queries/getReport'
import { GetReports } from './reports/queries/getReports'
import { GetReportTemplates } from './reports/queries/getReportTemplates'
import { ReportAPIService } from '../../../../ingress/src/entities/report/services/reportAPIService'
import { ReportContentAPIService } from '../../../../ingress/src/entities/report/services/reportContentAPIService'
import { ReportRefsAPIService } from '../../../../ingress/src/entities/report/services/reportRefsAPIService'
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
    ProceedingAPIService,
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
  ],
  controllers: [FileUploadController],
})
export class ApiModule {}
