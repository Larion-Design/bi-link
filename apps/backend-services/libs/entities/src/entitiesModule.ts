import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FileModel, FileSchema } from '@app/entities/models/fileModel'
import { IdDocumentModel, IdDocumentSchema } from '@app/entities/models/idDocumentModel'
import { PersonModel, PersonSchema } from '@app/entities/models/personModel'
import { CustomFieldModel, CustomFieldSchema } from '@app/entities/models/customFieldModel'
import { RelationshipModel, RelationshipSchema } from '@app/entities/models/relationshipModel'
import { CompanyModel, CompanySchema } from '@app/entities/models/companyModel'
import { AssociateModel, AssociateSchema } from '@app/entities/models/associateModel'
import { IncidentModel, IncidentSchema } from '@app/entities/models/incidentModel'
import { PartyModel, PartySchema } from '@app/entities/models/partyModel'
import { PersonsService } from '@app/entities/services/personsService'
import { CompaniesService } from '@app/entities/services/companiesService'
import { FilesService } from '@app/entities/services/filesService'
import { IncidentsService } from '@app/entities/services/incidentsService'
import { PropertyModel, PropertySchema } from '@app/entities/models/propertyModel'
import { PropertyOwnerModel, PropertyOwnerSchema } from '@app/entities/models/propertyOwnerModel'
import { ReportModel, ReportSchema } from '@app/entities/models/reportModel'
import { ReportSectionModel, ReportSectionSchema } from '@app/entities/models/reportSectionModel'
import { ReportContentModel, ReportContentSchema } from '@app/entities/models/reportContentModel'
import { PropertiesService } from '@app/entities/services/propertiesService'
import { LinkModel, LinkSchema } from '@app/entities/models/reports/linkModel'
import { TableModel, TableSchema } from '@app/entities/models/reports/tableModel'
import { TextModel, TextSchema } from '@app/entities/models/reports/textModel'
import { TitleModel, TitleSchema } from '@app/entities/models/reports/titleModel'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileModel.name, schema: FileSchema },
      { name: CustomFieldModel.name, schema: CustomFieldSchema },
      { name: PersonModel.name, schema: PersonSchema },
      { name: IdDocumentModel.name, schema: IdDocumentSchema },
      { name: RelationshipModel.name, schema: RelationshipSchema },
      { name: CompanyModel.name, schema: CompanySchema },
      { name: AssociateModel.name, schema: AssociateSchema },
      { name: IncidentModel.name, schema: IncidentSchema },
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
    ]),
  ],
  providers: [PersonsService, CompaniesService, FilesService, IncidentsService, PropertiesService],
  exports: [
    MongooseModule,
    PersonsService,
    CompaniesService,
    FilesService,
    IncidentsService,
    PropertiesService,
  ],
})
export class EntitiesModule {}
