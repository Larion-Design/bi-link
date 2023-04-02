import { AssociateModel, AssociateSchema } from 'src/company/models/associateModel'
import {
  CompanyHistorySnapshotModel,
  CompanyHistorySnapshotSchema,
} from 'src/company/models/companyHistorySnapshotModel'
import { CompanyModel, CompanySchema } from 'src/company/models/companyModel'
import {
  CompanyPendingSnapshotModel,
  CompanyPendingSnapshotSchema,
} from 'src/company/models/companyPendingSnapshotModel'
import { CompaniesService } from 'src/company/services/companiesService'
import { CompanyHistorySnapshotService } from 'src/company/services/companyHistorySnapshotService'
import { CompanyPendingSnapshotService } from 'src/company/services/companyPendingSnapshotService'
import {
  EventHistorySnapshotModel,
  EventHistorySnapshotSchema,
} from 'src/event/models/eventHistorySnapshotModel'
import { EventModel, EventSchema } from 'src/event/models/eventModel'
import {
  EventPendingSnapshotModel,
  EventPendingSnapshotSchema,
} from 'src/event/models/eventPendingSnapshotModel'
import { PartyModel, PartySchema } from 'src/event/models/partyModel'
import { EventHistorySnapshotService } from 'src/event/services/eventHistorySnapshotService'
import { EventPendingSnapshotService } from 'src/event/services/eventPendingSnapshotService'
import { EventsService } from 'src/event/services/eventsService'
import { FileModel, FileSchema } from 'src/file/models/fileModel'
import { FilesService } from 'src/file/services/filesService'
import { CoordinatesModel, CoordinatesSchema } from 'src/location/models/coordinatesModel'
import { LocationsService } from 'src/location/services/locationsService'
import {
  DateValueWithMetadataModel,
  DateValueWithMetadataSchema,
} from 'src/metadata/models/dateValueWithMetadataModel'
import { MetadataModel, MetadataSchema } from 'src/metadata/models/metadataModel'
import {
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
} from 'src/metadata/models/numberValueWithMetadataModel'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from 'src/metadata/models/optionalDateValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from 'src/metadata/models/textValueWithMetadataModel'
import { TrustModel, TrustSchema } from 'src/metadata/models/trustModel'
import { EducationModel, EducationSchema } from 'src/person/models/educationModel'
import { IdDocumentModel, IdDocumentSchema } from 'src/person/models/idDocumentModel'
import { PersonModel, PersonSchema } from 'src/person/models/personModel'
import { RelationshipModel, RelationshipSchema } from 'src/person/models/relationshipModel'
import { PersonHistorySnapshotService } from 'src/person/services/personHistorySnapshotService'
import { PersonPendingSnapshotService } from 'src/person/services/personPendingSnapshotService'
import { PersonsService } from 'src/person/services/personsService'
import {
  ProceedingEntityModel,
  ProceedingEntitySchema,
} from 'src/proceeding/models/proceedingEntityModel'
import {
  ProceedingHistorySnapshotModel,
  ProceedingHistorySnapshotSchema,
} from 'src/proceeding/models/proceedingHistorySnapshotModel'
import { ProceedingModel, ProceedingSchema } from 'src/proceeding/models/proceedingModel'
import {
  ProceedingPendingSnapshotModel,
  ProceedingPendingSnapshotSchema,
} from 'src/proceeding/models/proceedingPendingSnapshotModel'
import { ProceedingHistorySnapshotService } from 'src/proceeding/services/proceedingHistorySnapshotService'
import { ProceedingPendingSnapshotService } from 'src/proceeding/services/proceedingPendingSnapshotService'
import { ProceedingsService } from 'src/proceeding/services/proceedingsService'
import {
  PropertyHistorySnapshotModel,
  PropertyHistorySnapshotSchema,
} from 'src/property/models/propertyHistorySnapshotModel'
import { PropertyModel, PropertySchema } from 'src/property/models/propertyModel'
import { PropertyOwnerModel, PropertyOwnerSchema } from 'src/property/models/propertyOwnerModel'
import {
  PropertyPendingSnapshotModel,
  PropertyPendingSnapshotSchema,
} from 'src/property/models/propertyPendingSnapshotModel'
import { PropertiesService } from 'src/property/services/propertiesService'
import { PropertyHistorySnapshotService } from 'src/property/services/propertyHistorySnapshotService'
import { PropertyPendingSnapshotService } from 'src/property/services/propertyPendingSnapshotService'
import { LinkModel, LinkSchema } from 'src/report/models/content/linkModel'
import { TableModel, TableSchema } from 'src/report/models/content/tableModel'
import { TextModel, TextSchema } from 'src/report/models/content/textModel'
import { TitleModel, TitleSchema } from 'src/report/models/content/titleModel'
import { DataRefModel, DataRefSchema } from 'src/report/models/dataRefModel'
import { ReportContentModel, ReportContentSchema } from 'src/report/models/reportContentModel'
import {
  ReportHistorySnapshotModel,
  ReportHistorySnapshotSchema,
} from 'src/report/models/reportHistorySnapshotModel'
import { ReportModel, ReportSchema } from 'src/report/models/reportModel'
import {
  ReportPendingSnapshotModel,
  ReportPendingSnapshotSchema,
} from 'src/report/models/reportPendingSnapshotModel'
import { ReportSectionModel, ReportSectionSchema } from 'src/report/models/reportSectionModel'
import { ReportHistorySnapshotService } from 'src/report/services/reportHistorySnapshotService'
import { ReportPendingSnapshotService } from 'src/report/services/reportPendingSnapshotService'
import { ReportsService } from 'src/report/services/reportsService'
import { CustomFieldModel, CustomFieldSchema } from 'src/shared/models/customFieldModel'

import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { LocationModel, LocationSchema } from 'src/location/models/locationModel'
import {
  PersonPendingSnapshotModel,
  PersonPendingSnapshotSchema,
} from 'src/person/models/personPendingSnapshotModel'
import {
  PersonHistorySnapshotModel,
  PersonHistorySnapshotSchema,
} from 'src/person/models/personHistorySnapshotModel'
import { OldNameModel, OldNameSchema } from 'src/person/models/oldNameModel'

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

    CompaniesService,
    CompanyHistorySnapshotService,
    CompanyPendingSnapshotService,

    EventsService,
    EventHistorySnapshotService,
    EventPendingSnapshotService,

    ProceedingsService,
    ProceedingHistorySnapshotService,
    ProceedingPendingSnapshotService,

    PropertiesService,
    PropertyPendingSnapshotService,
    PropertyHistorySnapshotService,

    ReportsService,
    ReportPendingSnapshotService,
    ReportHistorySnapshotService,

    LocationsService,
    FilesService,
  ],
  exports: [
    MongooseModule,

    PersonsService,
    PersonHistorySnapshotService,
    PersonPendingSnapshotService,

    CompaniesService,
    CompanyHistorySnapshotService,
    CompanyPendingSnapshotService,

    EventsService,
    EventHistorySnapshotService,
    EventPendingSnapshotService,

    ProceedingsService,
    ProceedingHistorySnapshotService,
    ProceedingPendingSnapshotService,

    PropertiesService,
    PropertyPendingSnapshotService,
    PropertyHistorySnapshotService,

    ReportsService,
    ReportPendingSnapshotService,
    ReportHistorySnapshotService,

    LocationsService,
    FilesService,
  ],
})
export class EntitiesModule {}
