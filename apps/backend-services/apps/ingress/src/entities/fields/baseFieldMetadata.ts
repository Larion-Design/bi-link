import { Schema } from '@nestjs/mongoose'

@Schema({ _id: false, timestamps: false })
export class BaseFieldMetadata {}
