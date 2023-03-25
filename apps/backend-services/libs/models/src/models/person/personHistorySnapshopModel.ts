import { Schema } from '@nestjs/mongoose'

@Schema()
export class PersonHistorySnapshopModel implements Snapshot {
  _id: string
}
