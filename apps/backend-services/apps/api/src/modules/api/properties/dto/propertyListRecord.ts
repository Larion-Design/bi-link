import { PropertyListRecord as PropertyListRecordType } from 'defs'
import { ObjectType, PickType } from '@nestjs/graphql'
import { Property } from './property'

@ObjectType()
export class PropertyListRecord
  extends PickType(Property, ['_id', 'name', 'type'] as const)
  implements PropertyListRecordType {}
