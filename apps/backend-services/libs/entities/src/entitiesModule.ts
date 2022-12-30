import {AssociateModel, AssociateSchema} from '@app/entities/models/associateModel'
import {CompanyModel, CompanySchema} from '@app/entities/models/companyModel'
import {CustomFieldModel, CustomFieldSchema} from '@app/entities/models/customFieldModel'
import {FileModel, FileSchema} from '@app/entities/models/fileModel'
import {IdDocumentModel, IdDocumentSchema} from '@app/entities/models/idDocumentModel'
import {IncidentModel, IncidentSchema} from '@app/entities/models/incidentModel'
import {PartyModel, PartySchema} from '@app/entities/models/partyModel'
import {PersonModel, PersonSchema} from '@app/entities/models/personModel'
import {PropertyModel, PropertySchema} from '@app/entities/models/propertyModel'
import {PropertyOwnerModel, PropertyOwnerSchema} from '@app/entities/models/propertyOwnerModel'
import {RelationshipModel, RelationshipSchema} from '@app/entities/models/relationshipModel'
import {ReportContentModel, ReportContentSchema} from '@app/entities/models/reportContentModel'
import {ReportModel, ReportSchema} from '@app/entities/models/reportModel'
import {LinkModel, LinkSchema} from '@app/entities/models/reports/linkModel'
import {TableModel, TableSchema} from '@app/entities/models/reports/tableModel'
import {TextModel, TextSchema} from '@app/entities/models/reports/textModel'
import {TitleModel, TitleSchema} from '@app/entities/models/reports/titleModel'
import {ReportSectionModel, ReportSectionSchema} from '@app/entities/models/reportSectionModel'
import {CompaniesService} from '@app/entities/services/companiesService'
import {FilesService} from '@app/entities/services/filesService'
import {IncidentsService} from '@app/entities/services/incidentsService'
import {PersonsService} from '@app/entities/services/personsService'
import {PropertiesService} from '@app/entities/services/propertiesService'
import {ReportsService} from '@app/entities/services/reportsService'
import {Global, Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'

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
  providers: [
    PersonsService,
    CompaniesService,
    FilesService,
    IncidentsService,
    PropertiesService,
    ReportsService,
  ],
  exports: [
    MongooseModule,
    PersonsService,
    CompaniesService,
    FilesService,
    IncidentsService,
    PropertiesService,
    ReportsService,
  ],
})
export class EntitiesModule {}
