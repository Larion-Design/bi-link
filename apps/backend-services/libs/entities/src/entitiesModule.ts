import { LocationsService } from '@app/entities/services/locationsService'
import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CoordinatesModel, CoordinatesSchema } from '@app/entities/models/coordinatesModel'
import { LocationModel, LocationSchema } from '@app/entities/models/locationModel'
import { EducationModel, EducationSchema } from '@app/entities/models/person/educationModel'
import { OldNameModel, OldNameSchema } from '@app/entities/models/person/oldNameModel'
import { AssociateModel, AssociateSchema } from '@app/entities/models/company/associateModel'
import { CompanyModel, CompanySchema } from '@app/entities/models/company/companyModel'
import { CustomFieldModel, CustomFieldSchema } from '@app/entities/models/customFieldModel'
import { FileModel, FileSchema } from '@app/entities/models/fileModel'
import { IdDocumentModel, IdDocumentSchema } from '@app/entities/models/person/idDocumentModel'
import { EventModel, EventSchema } from '@app/entities/models/event/eventModel'
import { PartyModel, PartySchema } from '@app/entities/models/event/partyModel'
import { PersonModel, PersonSchema } from '@app/entities/models/person/personModel'
import { PropertyModel, PropertySchema } from '@app/entities/models/property/propertyModel'
import {
  PropertyOwnerModel,
  PropertyOwnerSchema,
} from '@app/entities/models/property/propertyOwnerModel'
import {
  RelationshipModel,
  RelationshipSchema,
} from '@app/entities/models/person/relationshipModel'
import { DataRefModel, DataRefSchema } from '@app/entities/models/reports/refs/dataRefModel'
import {
  ReportContentModel,
  ReportContentSchema,
} from '@app/entities/models/reports/reportContentModel'
import { ReportModel, ReportSchema } from '@app/entities/models/reports/reportModel'
import { LinkModel, LinkSchema } from '@app/entities/models/reports/content/linkModel'
import { TableModel, TableSchema } from '@app/entities/models/reports/content/tableModel'
import { TextModel, TextSchema } from '@app/entities/models/reports/content/textModel'
import { TitleModel, TitleSchema } from '@app/entities/models/reports/content/titleModel'
import {
  ReportSectionModel,
  ReportSectionSchema,
} from '@app/entities/models/reports/reportSectionModel'
import { CompaniesService } from '@app/entities/services/companiesService'
import { FilesService } from '@app/entities/services/filesService'
import { EventsService } from '@app/entities/services/eventsService'
import { PersonsService } from '@app/entities/services/personsService'
import { PropertiesService } from '@app/entities/services/propertiesService'
import { ReportsService } from '@app/entities/services/reportsService'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileModel.name, schema: FileSchema },
      { name: LocationModel.name, schema: LocationSchema },
      { name: CoordinatesModel.name, schema: CoordinatesSchema },
      { name: CustomFieldModel.name, schema: CustomFieldSchema },
      { name: PersonModel.name, schema: PersonSchema },
      { name: OldNameModel.name, schema: OldNameSchema },
      { name: IdDocumentModel.name, schema: IdDocumentSchema },
      { name: RelationshipModel.name, schema: RelationshipSchema },
      { name: EducationModel.name, schema: EducationSchema },
      { name: CompanyModel.name, schema: CompanySchema },
      { name: AssociateModel.name, schema: AssociateSchema },
      { name: EventModel.name, schema: EventSchema },
      { name: PartyModel.name, schema: PartySchema },
      { name: PropertyModel.name, schema: PropertySchema },
      { name: PropertyOwnerModel.name, schema: PropertyOwnerSchema },
      { name: ReportModel.name, schema: ReportSchema },
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
  ],
})
export class EntitiesModule {}
