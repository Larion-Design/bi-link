import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { OldNameAPI } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class OldName extends PickType(WithMetadata, ['metadata'] as const) implements OldNameAPI {
  @Field()
  name: string

  @Field()
  changeReason: string
}
