import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { OldName as OldNameAPI } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class OldName extends PickType(WithMetadata, ['metadata'] as const) implements OldNameAPI {
  @Field(() => ID, { nullable: true })
  _id?: string

  @Field()
  name: string

  @Field()
  changeReason: string
}
