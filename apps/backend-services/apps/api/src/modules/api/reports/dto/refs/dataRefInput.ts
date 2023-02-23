import { Field, InputType } from '@nestjs/graphql'
import { DataRefAPI } from 'defs'
import { ConnectedEntityInput } from '../../../common/dto/connectedEntityInput'

@InputType()
export class DataRefInput implements DataRefAPI {
  @Field({ nullable: true })
  _id: string

  @Field(() => ConnectedEntityInput, { nullable: true })
  person?: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  company?: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  property?: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  event?: ConnectedEntityInput

  @Field({ nullable: true })
  targetId?: string

  @Field({ nullable: true })
  path?: string

  @Field()
  field: string
}
