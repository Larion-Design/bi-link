import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AssociateModel, AssociateSchema } from './company/models/associateModel'
import {
  CompanyHistorySnapshotModel,
  CompanyHistorySnapshotSchema,
} from './company/models/companyHistorySnapshotModel'
import { CompanyModel, CompanySchema } from './company/models/companyModel'
import {
  CompanyPendingSnapshotModel,
  CompanyPendingSnapshotSchema,
} from './company/models/companyPendingSnapshotModel'
import { AssociatesService } from './company/services/associatesService'
import { CompaniesService } from './company/services/companiesService'
import { CompanyAPIService } from './company/services/companyAPIService'
import { CompanyHistorySnapshotService } from './company/services/companyHistorySnapshotService'
import { CompanyPendingSnapshotService } from './company/services/companyPendingSnapshotService'
import { CustomFieldModel, CustomFieldSchema } from './customField/models/customFieldModel'
import { CustomFieldsService } from './customField/services/customFieldsService'
import {
  EventHistorySnapshotModel,
  EventHistorySnapshotSchema,
} from './event/models/eventHistorySnapshotModel'
import { EventModel, EventSchema } from './event/models/eventModel'
import {
  EventPendingSnapshotModel,
  EventPendingSnapshotSchema,
} from './event/models/eventPendingSnapshotModel'
import { PartyModel, PartySchema } from './event/models/partyModel'
import { EventAPIService } from './event/services/eventAPIService'
import { EventHistorySnapshotService } from './event/services/eventHistorySnapshotService'
import { EventPendingSnapshotService } from './event/services/eventPendingSnapshotService'
import { EventsService } from './event/services/eventsService'
import { PartyAPIService } from './event/services/partyAPIService'
import { FileModel, FileSchema } from './file/models/fileModel'
import { FileAPIService } from './file/services/fileAPIService'
import { FilesService } from './file/services/filesService'
import { CoordinatesModel, CoordinatesSchema } from './location/models/coordinatesModel'
import { LocationModel, LocationSchema } from './location/models/locationModel'
import { LocationAPIService } from './location/services/locationAPIService'
import { LocationsService } from './location/services/locationsService'
import {
  DateValueWithMetadataModel,
  DateValueWithMetadataSchema,
} from './metadata/models/dateValueWithMetadataModel'
import { MetadataModel, MetadataSchema } from './metadata/models/metadataModel'
import {
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
} from './metadata/models/numberValueWithMetadataModel'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from './metadata/models/optionalDateValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from './metadata/models/textValueWithMetadataModel'
import { TrustModel, TrustSchema } from './metadata/models/trustModel'
import { EducationModel, EducationSchema } from './person/models/educationModel'
import { IdDocumentModel, IdDocumentSchema } from './person/models/idDocumentModel'
import { OldNameModel, OldNameSchema } from './person/models/oldNameModel'
import {
  PersonHistorySnapshotModel,
  PersonHistorySnapshotSchema,
} from './person/models/personHistorySnapshotModel'
import { PersonModel, PersonSchema } from './person/models/personModel'
import {
  PersonPendingSnapshotModel,
  PersonPendingSnapshotSchema,
} from './person/models/personPendingSnapshotModel'
import { RelationshipModel, RelationshipSchema } from './person/models/relationshipModel'
import { PersonAPIService } from './person/services/personAPIService'
import { PersonHistorySnapshotService } from './person/services/personHistorySnapshotService'
import { PersonPendingSnapshotService } from './person/services/personPendingSnapshotService'
import { PersonsService } from './person/services/personsService'
import { RelationshipsAPIService } from './person/services/relationshipsAPIService'
import {
  ProceedingEntityModel,
  ProceedingEntitySchema,
} from './proceeding/models/proceedingEntityModel'
import {
  ProceedingHistorySnapshotModel,
  ProceedingHistorySnapshotSchema,
} from './proceeding/models/proceedingHistorySnapshotModel'
import { ProceedingModel, ProceedingSchema } from './proceeding/models/proceedingModel'
import {
  ProceedingPendingSnapshotModel,
  ProceedingPendingSnapshotSchema,
} from './proceeding/models/proceedingPendingSnapshotModel'
import { ProceedingAPIService } from './proceeding/services/proceedingAPIService'
import { ProceedingHistorySnapshotService } from './proceeding/services/proceedingHistorySnapshotService'
import { ProceedingPendingSnapshotService } from './proceeding/services/proceedingPendingSnapshotService'
import { ProceedingsService } from './proceeding/services/proceedingsService'
import {
  PropertyHistorySnapshotModel,
  PropertyHistorySnapshotSchema,
} from './property/models/propertyHistorySnapshotModel'
import { PropertyModel, PropertySchema } from './property/models/propertyModel'
import { PropertyOwnerModel, PropertyOwnerSchema } from './property/models/propertyOwnerModel'
import {
  PropertyPendingSnapshotModel,
  PropertyPendingSnapshotSchema,
} from './property/models/propertyPendingSnapshotModel'
import { PropertiesService } from './property/services/propertiesService'
import { PropertyAPIService } from './property/services/propertyAPIService'
import { PropertyHistorySnapshotService } from './property/services/propertyHistorySnapshotService'
import { PropertyOwnerAPIService } from './property/services/propertyOwnerAPIService'
import { PropertyPendingSnapshotService } from './property/services/propertyPendingSnapshotService'
import { LinkModel, LinkSchema } from './report/models/content/linkModel'
import { TableModel, TableSchema } from './report/models/content/tableModel'
import { TextModel, TextSchema } from './report/models/content/textModel'
import { TitleModel, TitleSchema } from './report/models/content/titleModel'
import { DataRefModel, DataRefSchema } from './report/models/dataRefModel'
import { ReportContentModel, ReportContentSchema } from './report/models/reportContentModel'
import {
  ReportHistorySnapshotModel,
  ReportHistorySnapshotSchema,
} from './report/models/reportHistorySnapshotModel'
import { ReportModel, ReportSchema } from './report/models/reportModel'
import {
  ReportPendingSnapshotModel,
  ReportPendingSnapshotSchema,
} from './report/models/reportPendingSnapshotModel'
import { ReportSectionModel, ReportSectionSchema } from './report/models/reportSectionModel'
import { ReportAPIService } from './report/services/reportAPIService'
import { ReportContentAPIService } from './report/services/reportContentAPIService'
import { ReportHistorySnapshotService } from './report/services/reportHistorySnapshotService'
import { ReportPendingSnapshotService } from './report/services/reportPendingSnapshotService'
import { ReportRefsAPIService } from './report/services/reportRefsAPIService'
import { ReportsService } from './report/services/reportsService'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrustModel.name, schema: TrustSchema },
      { name: MetadataModel.name, schema: MetadataSchema },
      { name: TextValueWithMetadataModel.name, schema: TextValueWithMetadataSchema },
      { name: NumberValueWithMetadataModel.name, schema: NumberValueWithMetadataSchema },
      { name: DateValueWithMetadataModel.name, schema: DateValueWithMetadataSchema },
      {
        name: OptionalDateValueWithMetadataModel.name,
        schema: OptionalDateValueWithMetadataSchema,
      },
      { name: FileModel.name, schema: FileSchema },
      { name: LocationModel.name, schema: LocationSchema },
      { name: CoordinatesModel.name, schema: CoordinatesSchema },
      { name: CustomFieldModel.name, schema: CustomFieldSchema },
      { name: PersonModel.name, schema: PersonSchema },
      { name: PersonHistorySnapshotModel.name, schema: PersonHistorySnapshotSchema },
      { name: PersonPendingSnapshotModel.name, schema: PersonPendingSnapshotSchema },
      { name: OldNameModel.name, schema: OldNameSchema },
      { name: IdDocumentModel.name, schema: IdDocumentSchema },
      { name: RelationshipModel.name, schema: RelationshipSchema },
      { name: EducationModel.name, schema: EducationSchema },
      { name: CompanyModel.name, schema: CompanySchema },
      { name: CompanyHistorySnapshotModel.name, schema: CompanyHistorySnapshotSchema },
      { name: CompanyPendingSnapshotModel.name, schema: CompanyPendingSnapshotSchema },
      { name: AssociateModel.name, schema: AssociateSchema },
      { name: EventModel.name, schema: EventSchema },
      { name: EventHistorySnapshotModel.name, schema: EventHistorySnapshotSchema },
      { name: EventPendingSnapshotModel.name, schema: EventPendingSnapshotSchema },
      { name: PartyModel.name, schema: PartySchema },
      { name: PropertyModel.name, schema: PropertySchema },
      { name: PropertyHistorySnapshotModel.name, schema: PropertyHistorySnapshotSchema },
      { name: PropertyPendingSnapshotModel.name, schema: PropertyPendingSnapshotSchema },
      { name: PropertyOwnerModel.name, schema: PropertyOwnerSchema },
      { name: ProceedingModel.name, schema: ProceedingSchema },
      { name: ProceedingHistorySnapshotModel.name, schema: ProceedingHistorySnapshotSchema },
      { name: ProceedingPendingSnapshotModel.name, schema: ProceedingPendingSnapshotSchema },
      { name: ProceedingEntityModel.name, schema: ProceedingEntitySchema },
      { name: ReportModel.name, schema: ReportSchema },
      { name: ReportHistorySnapshotModel.name, schema: ReportHistorySnapshotSchema },
      { name: ReportPendingSnapshotModel.name, schema: ReportPendingSnapshotSchema },
      { name: ReportSectionModel.name, schema: ReportSectionSchema },
      { name: ReportContentModel.name, schema: ReportContentSchema },
      { name: LinkModel.name, schema: LinkSchema },
      { name: TableModel.name, schema: TableSchema },
      { name: TextModel.name, schema: TextSchema },
      { name: TitleModel.name, schema: TitleSchema },
      { name: DataRefModel.name, schema: DataRefSchema },
    ]),
  ],
  providers: [
    PersonsService,
    PersonHistorySnapshotService,
    PersonPendingSnapshotService,
    PersonAPIService,
    RelationshipsAPIService,

    CompaniesService,
    CompanyHistorySnapshotService,
    CompanyPendingSnapshotService,
    CompanyAPIService,
    AssociatesService,

    EventsService,
    EventHistorySnapshotService,
    EventPendingSnapshotService,
    EventAPIService,
    PartyAPIService,

    ProceedingsService,
    ProceedingHistorySnapshotService,
    ProceedingPendingSnapshotService,
    ProceedingAPIService,

    PropertiesService,
    PropertyPendingSnapshotService,
    PropertyHistorySnapshotService,
    PropertyAPIService,
    PropertyOwnerAPIService,

    ReportsService,
    ReportPendingSnapshotService,
    ReportHistorySnapshotService,
    ReportAPIService,
    ReportRefsAPIService,
    ReportContentAPIService,

    LocationsService,
    LocationAPIService,

    FilesService,
    FileAPIService,

    CustomFieldsService,
  ],
  exports: [
    MongooseModule,

    PersonsService,
    PersonHistorySnapshotService,
    PersonPendingSnapshotService,
    PersonAPIService,
    RelationshipsAPIService,

    CompaniesService,
    CompanyHistorySnapshotService,
    CompanyPendingSnapshotService,
    CompanyAPIService,
    AssociatesService,

    EventsService,
    EventHistorySnapshotService,
    EventPendingSnapshotService,
    EventAPIService,
    PartyAPIService,

    ProceedingsService,
    ProceedingHistorySnapshotService,
    ProceedingPendingSnapshotService,
    ProceedingAPIService,

    PropertiesService,
    PropertyPendingSnapshotService,
    PropertyHistorySnapshotService,
    PropertyAPIService,
    PropertyOwnerAPIService,

    ReportsService,
    ReportPendingSnapshotService,
    ReportHistorySnapshotService,
    ReportAPIService,
    ReportRefsAPIService,
    ReportContentAPIService,

    LocationsService,
    LocationAPIService,

    FilesService,
    FileAPIService,

    CustomFieldsService,
  ],
})
export class EntitiesModule {}
