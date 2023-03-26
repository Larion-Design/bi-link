import {
  CompanyHistorySnapshotModel,
  CompanyHistorySnapshotSchema,
  CompanyPendingSnapshotModel,
  CompanyPendingSnapshotSchema,
  EventHistorySnapshotModel,
  EventHistorySnapshotSchema,
  EventPendingSnapshotModel,
  EventPendingSnapshotSchema,
  MetadataModel,
  MetadataSchema,
  PersonHistorySnapshopModel,
  PersonHistorySnapshopSchema,
  PersonPendingSnapshopSchema,
  PersonPendingSnapshotModel,
  ProceedingHistorySnapshotModel,
  ProceedingHistorySnapshotSchema,
  ProceedingPendingSnapshotModel,
  ProceedingPendingSnapshotSchema,
  PropertyHistorySnapshotModel,
  PropertyHistorySnapshotSchema,
  PropertyPendingSnapshotModel,
  PropertyPendingSnapshotSchema,
  ReportHistorySnapshotModel,
  ReportHistorySnapshotSchema,
  ReportPendingSnapshotModel,
  ReportPendingSnapshotSchema,
  DateValueWithMetadataModel,
  DateValueWithMetadataSchema,
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '@app/models/models'

import { TrustModel, TrustSchema } from '@app/models/models/metadata/trustModel'
import {
  ProceedingEntityModel,
  ProceedingEntitySchema,
  ProceedingModel,
  ProceedingSchema,
} from '@app/models/models/proceeding'
import { ProceedingsService } from '@app/models/services/proceedingsService'
import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { LocationsService } from '@app/models/services/locationsService'
import { CoordinatesModel, CoordinatesSchema } from '@app/models/models/coordinatesModel'
import { LocationModel, LocationSchema } from '@app/models/models/locationModel'
import { EducationModel, EducationSchema } from '@app/models/models/person/educationModel'
import { OldNameModel, OldNameSchema } from '@app/models/models/person/oldNameModel'
import { AssociateModel, AssociateSchema } from '@app/models/models/company/associateModel'
import { CompanyModel, CompanySchema } from '@app/models/models/company/companyModel'
import { CustomFieldModel, CustomFieldSchema } from '@app/models/models/customFieldModel'
import { FileModel, FileSchema } from '@app/models/models/fileModel'
import { IdDocumentModel, IdDocumentSchema } from '@app/models/models/person/idDocumentModel'
import { EventModel, EventSchema } from '@app/models/models/event/eventModel'
import { PartyModel, PartySchema } from '@app/models/models/event/partyModel'
import { PersonModel, PersonSchema } from '@app/models/models/person/personModel'
import { PropertyModel, PropertySchema } from '@app/models/models/property/propertyModel'
import {
  PropertyOwnerModel,
  PropertyOwnerSchema,
} from '@app/models/models/property/propertyOwnerModel'
import { RelationshipModel, RelationshipSchema } from '@app/models/models/person/relationshipModel'
import { DataRefModel, DataRefSchema } from '@app/models/models/reports/dataRefModel'
import {
  ReportContentModel,
  ReportContentSchema,
} from '@app/models/models/reports/reportContentModel'
import { ReportModel, ReportSchema } from '@app/models/models/reports/reportModel'
import { LinkModel, LinkSchema } from '@app/models/models/reports/content/linkModel'
import { TableModel, TableSchema } from '@app/models/models/reports/content/tableModel'
import { TextModel, TextSchema } from '@app/models/models/reports/content/textModel'
import { TitleModel, TitleSchema } from '@app/models/models/reports/content/titleModel'
import {
  ReportSectionModel,
  ReportSectionSchema,
} from '@app/models/models/reports/reportSectionModel'
import { CompaniesService } from '@app/models/services/companiesService'
import { FilesService } from '@app/models/services/filesService'
import { EventsService } from '@app/models/services/eventsService'
import { PersonsService } from '@app/models/services/personsService'
import { PropertiesService } from '@app/models/services/propertiesService'
import { ReportsService } from '@app/models/services/reportsService'

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
      { name: PersonHistorySnapshopModel.name, schema: PersonHistorySnapshopSchema },
      { name: PersonPendingSnapshotModel.name, schema: PersonPendingSnapshopSchema },
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
    CompaniesService,
    FilesService,
    EventsService,
    PropertiesService,
    ReportsService,
    LocationsService,
    ProceedingsService,
  ],
  exports: [
    MongooseModule,
    PersonsService,
    CompaniesService,
    FilesService,
    EventsService,
    PropertiesService,
    ReportsService,
    LocationsService,
    ProceedingsService,
  ],
})
export class EntitiesModule {}
