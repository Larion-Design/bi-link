import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes, Types } from 'mongoose'
import { CustomFieldModel, CustomFieldSchema } from './customFieldModel'
import { FileModel } from './fileModel'
import { IdDocumentModel, IdDocumentSchema } from './idDocumentModel'
import { RelationshipModel, RelationshipSchema } from './relationshipModel'
import { Person } from '@app/definitions/person'

@Schema({ timestamps: true })
export class PersonModel implements Person {
  @Prop({ isRequired: false, default: '' })
  firstName: string

  @Prop({ isRequired: false, default: '' })
  lastName: string

  @Prop({ isRequired: false, default: '' })
  oldName: string

  @Prop({ isRequired: false, sparse: true })
  cnp: string

  @Prop({ type: SchemaTypes.Date, isRequired: false })
  birthdate: string | Date

  @Prop({ isRequired: false, default: '' })
  homeAddress: string

  @Prop({ type: Types.ObjectId, ref: FileModel.name, isRequired: false })
  image: FileModel

  @Prop({ type: [IdDocumentSchema], isRequired: false })
  documents: IdDocumentModel[]

  @Prop({ type: [RelationshipSchema], isRequired: false })
  relationships: RelationshipModel[]

  @Prop({ type: [CustomFieldSchema] })
  contactDetails: CustomFieldModel[]

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  files: FileModel[]

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]
}

export type PersonDocument = PersonModel & Document
export const PersonSchema = SchemaFactory.createForClass(PersonModel)
