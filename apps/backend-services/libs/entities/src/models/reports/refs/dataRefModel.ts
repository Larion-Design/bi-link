import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { CompanyDocument, CompanyModel } from '@app/entities/models/companyModel'
import { IncidentDocument, IncidentModel } from '@app/entities/models/incidentModel'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'
import { PropertyDocument, PropertyModel } from '@app/entities/models/propertyModel'
import {
  EntityInfoFieldModel,
  EntityInfoFieldSchema,
} from '@app/entities/models/reports/refs/entityInfoFieldModel'
import {
  RelationshipInfoFieldModel,
  RelationshipInfoFieldSchema,
} from '@app/entities/models/reports/refs/relationshipInfoFieldModel'
import { DataRef } from 'defs'

@Schema({ timestamps: false })
export class DataRefModel implements DataRef {
  @Prop()
  _id: string

  @Prop({ type: Types.ObjectId, ref: PersonModel.name, isRequired: false })
  person?: PersonDocument

  @Prop({ type: Types.ObjectId, ref: CompanyModel.name, isRequired: false })
  company?: CompanyDocument

  @Prop({ type: Types.ObjectId, ref: PropertyModel.name, isRequired: false })
  property?: PropertyDocument

  @Prop({ type: Types.ObjectId, ref: IncidentModel.name, isRequired: false })
  incident?: IncidentDocument

  @Prop({ type: [EntityInfoFieldSchema] })
  entityInfo?: EntityInfoFieldModel

  @Prop({ type: [RelationshipInfoFieldSchema] })
  relationshipInfo?: RelationshipInfoFieldModel
}

export type DataRefDocument = DataRefModel & Document
export const DataRefSchema = SchemaFactory.createForClass(DataRefModel)
