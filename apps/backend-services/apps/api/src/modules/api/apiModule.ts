import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { PubModule } from '@app/pub'
import { SearchModule } from '../search/searchModule'
import { UsersModule } from '../users/UsersModule'
import { GetCompany } from './companies/queries/getCompany'
import { CreateCompany } from './companies/mutations/createCompany'
import { UpdateCompany } from './companies/mutations/updateCompany'
import { SearchCompanies } from './companies/queries/searchCompanies'
import { CompanyCUIExists } from './companies/queries/companyCUIExists'
import { CompanyRegistrationNumberExists } from './companies/queries/companyRegistrationNumberExists'
import { GetCompanyFrequentCustomFields } from './companies/queries/getCompanyFrequentCustomFields'
import { GetPerson } from './persons/queries/getPerson'
import { GetPersons } from './persons/queries/getPersons'
import { SearchPersons } from './persons/queries/searchPersons'
import { CreatePerson } from './persons/mutations/createPerson'
import { UpdatePerson } from './persons/mutations/updatePerson'
import { PersonCNPExists } from './persons/queries/personCNPExists'
import { PersonIdDocumentExists } from './persons/queries/personIdDocumentExists'
import { FileUrl } from './files/fieldResolvers'
import { GetDownloadUrl } from './files/queries/getDownloadUrl'
import { GetPersonFrequentCustomFields } from './persons/queries/getPersonFrequentCustomFields'
import { CustomFieldsService } from './customFields/services/customFieldsService'
import { PersonAPIService } from './persons/services/personAPIService'
import { RelationshipsService } from './persons/services/relationshipsService'
import { IdDocumentsService } from './persons/services/idDocumentsService'
import { FileAPIService } from './files/services/fileAPIService'
import { CompanyAPIService } from './companies/services/companyAPIService'
import { LocationService } from './companies/services/locationService'
import { AssociatesService } from './companies/services/associatesService'
import { VinExists } from './properties/queries/vehicles/vinExists'
import { GetCompanies } from './companies/queries/getCompanies'
import { UserRegistered } from './users/mutations/userRegistered'
import { GetMakers } from './properties/queries/vehicles/getMakers'
import { GetModels } from './properties/queries/vehicles/getModels'
import { GetIncident } from './incidents/queries/getIncident'
import { SearchIncidents } from './incidents/queries/searchIncidents'
import { CreateIncident } from './incidents/mutations/createIncident'
import { UpdateIncident } from './incidents/mutations/updateIncident'
import { PartyAPIService } from './incidents/services/partyAPIService'
import { IncidentAPIService } from './incidents/services/incidentAPIService'
import { GetIncidentFrequentCustomFields } from './incidents/queries/getIncidentFrequentCustomFields'
import { FilesModule } from '@app/files'
import { FileUploadController } from './files/controllers/fileUploadController'
import { GraphModule } from '@app/graph-module'
import { GetEntitiesGraph } from './common/queries/getEntitiesGraph'
import { GetIncidents } from './incidents/queries/getIncidents'
import { GetUsers } from './users/queries/getUsers'
import { ChangeUserRole } from './users/mutations/changeUserRole'
import { DisableUser } from './users/mutations/disableUser'
import { GetProperty } from './properties/queries/getProperty'
import { CreateProperty } from './properties/mutations/createProperty'
import { PropertyAPIService } from './properties/services/propertyAPIService'
import { PropertyOwnerAPIService } from './properties/services/propertyOwnerAPIService'
import { GetDownloadUrls } from './files/queries/getDownloadUrls'
import { SearchProperties } from './properties/queries/searchProperties'
import { UpdateProperty } from './properties/mutations/updateProperty'
import { GetProperties } from './properties/queries/getProperties'

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
    GetDownloadUrl,
    GetDownloadUrls,
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
  ],
  controllers: [FileUploadController],
})
export class ApiModule {}
