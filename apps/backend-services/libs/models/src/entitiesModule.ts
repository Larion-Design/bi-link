import { AssociateModel, AssociateSchema } from '@app/models/company/models/associateModel'
import {
  CompanyHistorySnapshotModel,
  CompanyHistorySnapshotSchema,
} from '@app/models/company/models/companyHistorySnapshotModel'
import { CompanyModel, CompanySchema } from '@app/models/company/models/companyModel'
import {
  CompanyPendingSnapshotModel,
  CompanyPendingSnapshotSchema,
} from '@app/models/company/models/companyPendingSnapshotModel'
import { CompaniesService } from '@app/models/company/services/companiesService'
import { CompanyHistorySnapshotService } from '@app/models/company/services/companyHistorySnapshotService'
import { CompanyPendingSnapshotService } from '@app/models/company/services/companyPendingSnapshotService'
import {
  EventHistorySnapshotModel,
  EventHistorySnapshotSchema,
} from '@app/models/event/models/eventHistorySnapshotModel'
import { EventModel, EventSchema } from '@app/models/event/models/eventModel'
import {
  EventPendingSnapshotModel,
  EventPendingSnapshotSchema,
} from '@app/models/event/models/eventPendingSnapshotModel'
import { PartyModel, PartySchema } from '@app/models/event/models/partyModel'
import { EventHistorySnapshotService } from '@app/models/event/services/eventHistorySnapshotService'
import { EventPendingSnapshotService } from '@app/models/event/services/eventPendingSnapshotService'
import { EventsService } from '@app/models/event/services/eventsService'
import { FileModel, FileSchema } from '@app/models/file/models/fileModel'
import { FilesService } from '@app/models/file/services/filesService'
import { CoordinatesModel, CoordinatesSchema } from '@app/models/location/models/coordinatesModel'
import { LocationsService } from '@app/models/location/services/locationsService'
import {
  DateValueWithMetadataModel,
  DateValueWithMetadataSchema,
} from '@app/models/metadata/models/dateValueWithMetadataModel'
import { MetadataModel, MetadataSchema } from '@app/models/metadata/models/metadataModel'
import {
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
} from '@app/models/metadata/models/numberValueWithMetadataModel'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from '@app/models/metadata/models/optionalDateValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '@app/models/metadata/models/textValueWithMetadataModel'
import { TrustModel, TrustSchema } from '@app/models/metadata/models/trustModel'
import { EducationModel, EducationSchema } from '@app/models/person/models/educationModel'
import { IdDocumentModel, IdDocumentSchema } from '@app/models/person/models/idDocumentModel'
import { PersonModel, PersonSchema } from '@app/models/person/models/personModel'
import { RelationshipModel, RelationshipSchema } from '@app/models/person/models/relationshipModel'
import { PersonHistorySnapshotService } from '@app/models/person/services/personHistorySnapshotService'
import { PersonPendingSnapshotService } from '@app/models/person/services/personPendingSnapshotService'
import { PersonsService } from '@app/models/person/services/personsService'
import {
  ProceedingEntityModel,
  ProceedingEntitySchema,
} from '@app/models/proceeding/models/proceedingEntityModel'
import {
  ProceedingHistorySnapshotModel,
  ProceedingHistorySnapshotSchema,
} from '@app/models/proceeding/models/proceedingHistorySnapshotModel'
import { ProceedingModel, ProceedingSchema } from '@app/models/proceeding/models/proceedingModel'
import {
  ProceedingPendingSnapshotModel,
  ProceedingPendingSnapshotSchema,
} from '@app/models/proceeding/models/proceedingPendingSnapshotModel'
import { ProceedingHistorySnapshotService } from '@app/models/proceeding/services/proceedingHistorySnapshotService'
import { ProceedingPendingSnapshotService } from '@app/models/proceeding/services/proceedingPendingSnapshotService'
import { ProceedingsService } from '@app/models/proceeding/services/proceedingsService'
import {
  PropertyHistorySnapshotModel,
  PropertyHistorySnapshotSchema,
} from '@app/models/property/models/propertyHistorySnapshotModel'
import { PropertyModel, PropertySchema } from '@app/models/property/models/propertyModel'
import {
  PropertyOwnerModel,
  PropertyOwnerSchema,
} from '@app/models/property/models/propertyOwnerModel'
import {
  PropertyPendingSnapshotModel,
  PropertyPendingSnapshotSchema,
} from '@app/models/property/models/propertyPendingSnapshotModel'
import { PropertiesService } from '@app/models/property/services/propertiesService'
import { PropertyHistorySnapshotService } from '@app/models/property/services/propertyHistorySnapshotService'
import { PropertyPendingSnapshotService } from '@app/models/property/services/propertyPendingSnapshotService'
import { LinkModel, LinkSchema } from '@app/models/report/models/content/linkModel'
import { TableModel, TableSchema } from '@app/models/report/models/content/tableModel'
import { TextModel, TextSchema } from '@app/models/report/models/content/textModel'
import { TitleModel, TitleSchema } from '@app/models/report/models/content/titleModel'
import { DataRefModel, DataRefSchema } from '@app/models/report/models/dataRefModel'
import {
  ReportContentModel,
  ReportContentSchema,
} from '@app/models/report/models/reportContentModel'
import {
  ReportHistorySnapshotModel,
  ReportHistorySnapshotSchema,
} from '@app/models/report/models/reportHistorySnapshotModel'
import { ReportModel, ReportSchema } from '@app/models/report/models/reportModel'
import {
  ReportPendingSnapshotModel,
  ReportPendingSnapshotSchema,
} from '@app/models/report/models/reportPendingSnapshotModel'
import {
  ReportSectionModel,
  ReportSectionSchema,
} from '@app/models/report/models/reportSectionModel'
import { ReportHistorySnapshotService } from '@app/models/report/services/reportHistorySnapshotService'
import { ReportPendingSnapshotService } from '@app/models/report/services/reportPendingSnapshotService'
import { ReportsService } from '@app/models/report/services/reportsService'
import { CustomFieldModel, CustomFieldSchema } from '@app/models/shared/models/customFieldModel'

import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { LocationModel, LocationSchema } from '@app/models/location/models/locationModel'
import {
  PersonPendingSnapshotModel,
  PersonPendingSnapshotSchema,
} from '@app/models/person/models/personPendingSnapshotModel'
import {
  PersonHistorySnapshotModel,
  PersonHistorySnapshotSchema,
} from '@app/models/person/models/personHistorySnapshotModel'
import { OldNameModel, OldNameSchema } from '@app/models/person/models/oldNameModel'

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
