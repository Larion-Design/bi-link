import { FilesModule } from '@app/files'
import { GraphModule } from '@app/graph-module'
import { PubModule } from '@app/pub'
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { SearchModule } from '../search/searchModule'
import { UsersModule } from '../users/UsersModule'
import { GetEntitiesGraph } from './common/queries/getEntitiesGraph'
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
import { LocationService } from './companies/services/locationService'
import { CustomFieldsService } from './customFields/services/customFieldsService'
import { FileUploadController } from './files/controllers/fileUploadController'
import { FileUrl } from './files/fieldResolvers'
import { GetFileInfo } from './files/queries/getFileInfo'
import { GetFilesInfo } from './files/queries/getFilesInfo'
import { FileAPIService } from './files/services/fileAPIService'
import { CreateIncident } from './incidents/mutations/createIncident'
import { UpdateIncident } from './incidents/mutations/updateIncident'
import { GetIncident } from './incidents/queries/getIncident'
import { GetIncidentFrequentCustomFields } from './incidents/queries/getIncidentFrequentCustomFields'
import { GetIncidents } from './incidents/queries/getIncidents'
import { SearchIncidents } from './incidents/queries/searchIncidents'
import { IncidentAPIService } from './incidents/services/incidentAPIService'
import { PartyAPIService } from './incidents/services/partyAPIService'
import { CreatePerson } from './persons/mutations/createPerson'
import { UpdatePerson } from './persons/mutations/updatePerson'
import { GetPerson } from './persons/queries/getPerson'
import { GetPersonFrequentCustomFields } from './persons/queries/getPersonFrequentCustomFields'
import { GetPersons } from './persons/queries/getPersons'
import { PersonCNPExists } from './persons/queries/personCNPExists'
import { PersonIdDocumentExists } from './persons/queries/personIdDocumentExists'
import { SearchPersons } from './persons/queries/searchPersons'
import { IdDocumentsService } from './persons/services/idDocumentsService'
import { PersonAPIService } from './persons/services/personAPIService'
import { RelationshipsService } from './persons/services/relationshipsService'
import { CreateProperty } from './properties/mutations/createProperty'
import { UpdateProperty } from './properties/mutations/updateProperty'
import { GetProperties } from './properties/queries/getProperties'
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
import { ChangeUserRole } from './users/mutations/changeUserRole'
import { DisableUser } from './users/mutations/disableUser'
import { UserRegistered } from './users/mutations/userRegistered'
import { GetUsers } from './users/queries/getUsers'

@Module({
  imports: [
    PubModule,
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
    RelationshipsService,
    IdDocumentsService,
    FileAPIService,
    CompanyAPIService,
    LocationService,
    AssociatesService,
    IncidentAPIService,
    PartyAPIService,
    PropertyAPIService,
    PropertyOwnerAPIService,
    ReportAPIService,
    ReportContentAPIService,

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
    UserRegistered,
    GetIncident,
    SearchIncidents,
    CreateIncident,
    UpdateIncident,
    GetIncidentFrequentCustomFields,
    GetIncidents,
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
  ],
  controllers: [FileUploadController],
})
export class ApiModule {}
