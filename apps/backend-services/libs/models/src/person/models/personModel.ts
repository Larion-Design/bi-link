import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { MetadataModel, MetadataSchema } from '@app/models/metadata/models/metadataModel'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from '@app/models/metadata/models/optionalDateValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '@app/models/metadata/models/textValueWithMetadataModel'
import { LocationDocument, LocationModel } from '@app/models/location/models/locationModel'
import { EducationModel, EducationSchema } from '@app/models/person/models/educationModel'
import { OldNameModel, OldNameSchema } from '@app/models/person/models/oldNameModel'
import { Person } from 'defs'
import { CustomFieldModel, CustomFieldSchema } from '../../shared/models/customFieldModel'
import { FileModel } from '../../file/models/fileModel'
import { IdDocumentModel, IdDocumentSchema } from './idDocumentModel'
import { RelationshipModel, RelationshipSchema } from './relationshipModel'

@Schema({ timestamps: true })
export class PersonModel implements Person {
  _id: string

  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  firstName: TextValueWithMetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  lastName: TextValueWithMetadataModel

  @Prop({ type: [OldNameSchema] })
  oldNames: OldNameModel[]

  @Prop({ type: TextValueWithMetadataSchema })
  cnp: TextValueWithMetadataModel

  @Prop({ type: OptionalDateValueWithMetadataSchema })
  birthdate: OptionalDateValueWithMetadataModel

  @Prop({ type: Types.ObjectId, ref: LocationModel.name, default: null })
  birthPlace: LocationDocument | null

  @Prop({ type: Types.ObjectId, ref: LocationModel.name, default: null })
  homeAddress: LocationDocument | null

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  images: FileModel[]

  @Prop({ type: [IdDocumentSchema] })
  documents: IdDocumentModel[]

  @Prop({ type: [RelationshipSchema] })
  relationships: RelationshipModel[]

  @Prop({ type: [CustomFieldSchema] })
  contactDetails: CustomFieldModel[]

  @Prop({ type: [EducationSchema] })
  education: EducationModel[]

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  files: FileModel[]

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type PersonDocument = PersonModel & Document<string>
export const PersonSchema = SchemaFactory.createForClass(PersonModel)
