import { Global, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AssociateModel,
  AssociateSchema,
} from './schema/company/models/associateModel';
import {
  CompanyHistorySnapshotModel,
  CompanyHistorySnapshotSchema,
} from './schema/company/models/companyHistorySnapshotModel';
import {
  CompanyModel,
  CompanySchema,
} from './schema/company/models/companyModel';
import {
  CompanyPendingSnapshotModel,
  CompanyPendingSnapshotSchema,
} from './schema/company/models/companyPendingSnapshotModel';
import { AssociatesService } from './schema/company/services/associatesService';
import { CompaniesService } from './schema/company/services/companiesService';
import { CompanyAPIService } from './schema/company/services/companyAPIService';
import { CompanyHistorySnapshotService } from './schema/company/services/companyHistorySnapshotService';
import { CompanyPendingSnapshotService } from './schema/company/services/companyPendingSnapshotService';
import {
  CustomFieldModel,
  CustomFieldSchema,
} from './schema/customField/models/customFieldModel';
import { CustomFieldsService } from './schema/customField/services/customFieldsService';
import {
  EventHistorySnapshotModel,
  EventHistorySnapshotSchema,
} from './schema/event/models/eventHistorySnapshotModel';
import { EventModel, EventSchema } from './schema/event/models/eventModel';
import {
  EventPendingSnapshotModel,
  EventPendingSnapshotSchema,
} from './schema/event/models/eventPendingSnapshotModel';
import { PartyModel, PartySchema } from './schema/event/models/partyModel';
import { EventAPIService } from './schema/event/services/eventAPIService';
import { EventHistorySnapshotService } from './schema/event/services/eventHistorySnapshotService';
import { EventPendingSnapshotService } from './schema/event/services/eventPendingSnapshotService';
import { EventsService } from './schema/event/services/eventsService';
import { PartyAPIService } from './schema/event/services/partyAPIService';
import { FileModel, FileSchema } from './schema/file/models/fileModel';
import { FileAPIService } from './schema/file/services/fileAPIService';
import { FilesService } from './schema/file/services/filesService';
import {
  CoordinatesModel,
  CoordinatesSchema,
} from './schema/location/models/coordinatesModel';
import {
  LocationModel,
  LocationSchema,
} from './schema/location/models/locationModel';
import { LocationAPIService } from './schema/location/services/locationAPIService';
import { LocationsService } from './schema/location/services/locationsService';
import {
  BooleanValueWithMetadataModel,
  BooleanValueWithMetadataSchema,
} from './schema/metadata/models/booleanValueWithMetadataModel';
import {
  DateValueWithMetadataModel,
  DateValueWithMetadataSchema,
} from './schema/metadata/models/dateValueWithMetadataModel';
import {
  MetadataModel,
  MetadataSchema,
} from './schema/metadata/models/metadataModel';
import {
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
} from './schema/metadata/models/numberValueWithMetadataModel';
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from './schema/metadata/models/optionalDateValueWithMetadataModel';
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from './schema/metadata/models/textValueWithMetadataModel';
import { TrustModel, TrustSchema } from './schema/metadata/models/trustModel';
import {
  EducationModel,
  EducationSchema,
} from './schema/person/models/educationModel';
import {
  IdDocumentModel,
  IdDocumentSchema,
} from './schema/person/models/idDocumentModel';
import {
  OldNameModel,
  OldNameSchema,
} from './schema/person/models/oldNameModel';
import {
  PersonHistorySnapshotModel,
  PersonHistorySnapshotSchema,
} from './schema/person/models/personHistorySnapshotModel';
import { PersonModel, PersonSchema } from './schema/person/models/personModel';
import {
  PersonPendingSnapshotModel,
  PersonPendingSnapshotSchema,
} from './schema/person/models/personPendingSnapshotModel';
import {
  RelationshipModel,
  RelationshipSchema,
} from './schema/person/models/relationshipModel';
import { PersonAPIService } from './schema/person/services/personAPIService';
import { PersonHistorySnapshotService } from './schema/person/services/personHistorySnapshotService';
import { PersonPendingSnapshotService } from './schema/person/services/personPendingSnapshotService';
import { PersonsService } from './schema/person/services/personsService';
import { RelationshipsAPIService } from './schema/person/services/relationshipsAPIService';
import {
  ProceedingEntityModel,
  ProceedingEntitySchema,
} from './schema/proceeding/models/proceedingEntityModel';
import {
  ProceedingHistorySnapshotModel,
  ProceedingHistorySnapshotSchema,
} from './schema/proceeding/models/proceedingHistorySnapshotModel';
import {
  ProceedingModel,
  ProceedingSchema,
} from './schema/proceeding/models/proceedingModel';
import {
  ProceedingPendingSnapshotModel,
  ProceedingPendingSnapshotSchema,
} from './schema/proceeding/models/proceedingPendingSnapshotModel';
import { ProceedingAPIService } from './schema/proceeding/services/proceedingAPIService';
import { ProceedingHistorySnapshotService } from './schema/proceeding/services/proceedingHistorySnapshotService';
import { ProceedingPendingSnapshotService } from './schema/proceeding/services/proceedingPendingSnapshotService';
import { ProceedingsService } from './schema/proceeding/services/proceedingsService';
import {
  PropertyHistorySnapshotModel,
  PropertyHistorySnapshotSchema,
} from './schema/property/models/propertyHistorySnapshotModel';
import {
  PropertyModel,
  PropertySchema,
} from './schema/property/models/propertyModel';
import {
  PropertyOwnerModel,
  PropertyOwnerSchema,
} from './schema/property/models/propertyOwnerModel';
import {
  PropertyPendingSnapshotModel,
  PropertyPendingSnapshotSchema,
} from './schema/property/models/propertyPendingSnapshotModel';
import { PropertiesService } from './schema/property/services/propertiesService';
import { PropertyAPIService } from './schema/property/services/propertyAPIService';
import { PropertyHistorySnapshotService } from './schema/property/services/propertyHistorySnapshotService';
import { PropertyOwnerAPIService } from './schema/property/services/propertyOwnerAPIService';
import { PropertyPendingSnapshotService } from './schema/property/services/propertyPendingSnapshotService';
import {
  LinkModel,
  LinkSchema,
} from './schema/report/models/content/linkModel';
import {
  TableModel,
  TableSchema,
} from './schema/report/models/content/tableModel';
import {
  TextModel,
  TextSchema,
} from './schema/report/models/content/textModel';
import {
  TitleModel,
  TitleSchema,
} from './schema/report/models/content/titleModel';
import {
  DataRefModel,
  DataRefSchema,
} from './schema/report/models/dataRefModel';
import {
  ReportContentModel,
  ReportContentSchema,
} from './schema/report/models/reportContentModel';
import {
  ReportHistorySnapshotModel,
  ReportHistorySnapshotSchema,
} from './schema/report/models/reportHistorySnapshotModel';
import { ReportModel, ReportSchema } from './schema/report/models/reportModel';
import {
  ReportPendingSnapshotModel,
  ReportPendingSnapshotSchema,
} from './schema/report/models/reportPendingSnapshotModel';
import {
  ReportSectionModel,
  ReportSectionSchema,
} from './schema/report/models/reportSectionModel';
import { ReportAPIService } from './schema/report/services/reportAPIService';
import { ReportContentAPIService } from './schema/report/services/reportContentAPIService';
import { ReportHistorySnapshotService } from './schema/report/services/reportHistorySnapshotService';
import { ReportPendingSnapshotService } from './schema/report/services/reportPendingSnapshotService';
import { ReportRefsAPIService } from './schema/report/services/reportRefsAPIService';
import { ReportsService } from './schema/report/services/reportsService';

const providers: Provider[] = [
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
];

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrustModel.name, schema: TrustSchema },
      { name: MetadataModel.name, schema: MetadataSchema },
      {
        name: TextValueWithMetadataModel.name,
        schema: TextValueWithMetadataSchema,
      },
      {
        name: NumberValueWithMetadataModel.name,
        schema: NumberValueWithMetadataSchema,
      },
      {
        name: DateValueWithMetadataModel.name,
        schema: DateValueWithMetadataSchema,
      },
      {
        name: OptionalDateValueWithMetadataModel.name,
        schema: OptionalDateValueWithMetadataSchema,
      },
      {
        name: BooleanValueWithMetadataModel.name,
        schema: BooleanValueWithMetadataSchema,
      },
      { name: FileModel.name, schema: FileSchema },
      { name: LocationModel.name, schema: LocationSchema },
      { name: CoordinatesModel.name, schema: CoordinatesSchema },
      { name: CustomFieldModel.name, schema: CustomFieldSchema },
      { name: PersonModel.name, schema: PersonSchema },
      {
        name: PersonHistorySnapshotModel.name,
        schema: PersonHistorySnapshotSchema,
      },
      {
        name: PersonPendingSnapshotModel.name,
        schema: PersonPendingSnapshotSchema,
      },
      { name: OldNameModel.name, schema: OldNameSchema },
      { name: IdDocumentModel.name, schema: IdDocumentSchema },
      { name: RelationshipModel.name, schema: RelationshipSchema },
      { name: EducationModel.name, schema: EducationSchema },
      { name: CompanyModel.name, schema: CompanySchema },
      {
        name: CompanyHistorySnapshotModel.name,
        schema: CompanyHistorySnapshotSchema,
      },
      {
        name: CompanyPendingSnapshotModel.name,
        schema: CompanyPendingSnapshotSchema,
      },
      { name: AssociateModel.name, schema: AssociateSchema },
      { name: EventModel.name, schema: EventSchema },
      {
        name: EventHistorySnapshotModel.name,
        schema: EventHistorySnapshotSchema,
      },
      {
        name: EventPendingSnapshotModel.name,
        schema: EventPendingSnapshotSchema,
      },
      { name: PartyModel.name, schema: PartySchema },
      { name: PropertyModel.name, schema: PropertySchema },
      {
        name: PropertyHistorySnapshotModel.name,
        schema: PropertyHistorySnapshotSchema,
      },
      {
        name: PropertyPendingSnapshotModel.name,
        schema: PropertyPendingSnapshotSchema,
      },
      { name: PropertyOwnerModel.name, schema: PropertyOwnerSchema },
      { name: ProceedingModel.name, schema: ProceedingSchema },
      {
        name: ProceedingHistorySnapshotModel.name,
        schema: ProceedingHistorySnapshotSchema,
      },
      {
        name: ProceedingPendingSnapshotModel.name,
        schema: ProceedingPendingSnapshotSchema,
      },
      { name: ProceedingEntityModel.name, schema: ProceedingEntitySchema },
      { name: ReportModel.name, schema: ReportSchema },
      {
        name: ReportHistorySnapshotModel.name,
        schema: ReportHistorySnapshotSchema,
      },
      {
        name: ReportPendingSnapshotModel.name,
        schema: ReportPendingSnapshotSchema,
      },
      { name: ReportSectionModel.name, schema: ReportSectionSchema },
      { name: ReportContentModel.name, schema: ReportContentSchema },
      { name: LinkModel.name, schema: LinkSchema },
      { name: TableModel.name, schema: TableSchema },
      { name: TextModel.name, schema: TextSchema },
      { name: TitleModel.name, schema: TitleSchema },
      { name: DataRefModel.name, schema: DataRefSchema },
    ]),
  ],
  providers: providers,
  exports: providers,
})
export class CentralModule {}
