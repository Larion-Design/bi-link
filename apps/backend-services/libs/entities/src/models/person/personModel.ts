import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes, Types } from 'mongoose'
import { LocationDocument, LocationModel } from '@app/entities/models/locationModel'
import { EducationModel, EducationSchema } from '@app/entities/models/person/educationModel'
import { OldNameModel, OldNameSchema } from '@app/entities/models/person/oldNameModel'
import { Person } from 'defs'
import { CustomFieldModel, CustomFieldSchema } from '../customFieldModel'
import { FileModel } from '../fileModel'
import { IdDocumentModel, IdDocumentSchema } from './idDocumentModel'
import { RelationshipModel, RelationshipSchema } from './relationshipModel'

@Schema({ timestamps: true })
export class PersonModel implements Person {
  _id: string

  @Prop({ isRequired: false, default: '' })
  firstName: string

  @Prop({ isRequired: false, default: '' })
  lastName: string

  @Prop({ type: [OldNameSchema], isRequired: false })
  oldNames: OldNameModel[]

  @Prop({ isRequired: false, sparse: true })
  cnp: string

  @Prop({ type: SchemaTypes.Date, isRequired: false })
  birthdate: string | Date

  @Prop({ type: Types.ObjectId, ref: LocationModel.name })
  birthPlace: LocationDocument | null

  @Prop({ type: Types.ObjectId, ref: LocationModel.name })
  homeAddress: LocationDocument

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  images: FileModel[]

  @Prop({ type: [IdDocumentSchema], isRequired: false })
  documents: IdDocumentModel[]

  @Prop({ type: [RelationshipSchema], isRequired: false })
  relationships: RelationshipModel[]

  @Prop({ type: [CustomFieldSchema] })
  contactDetails: CustomFieldModel[]

  @Prop({ type: [EducationSchema], isRequired: false })
  education: EducationModel[]

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  files: FileModel[]

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]
}

export type PersonDocument = PersonModel & Document<string>
export const PersonSchema = SchemaFactory.createForClass(PersonModel)
