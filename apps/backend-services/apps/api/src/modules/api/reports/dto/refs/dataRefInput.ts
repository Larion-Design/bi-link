import { Field, InputType } from '@nestjs/graphql'
import { DataRefAPI } from 'defs'
import { ConnectedEntityInput } from '../../../common/dto/connectedEntityInput'
import { EntityInfoFieldInput } from './entityInfoFieldInput'
import { RelationshipInfoFieldInput } from './relationshipInfoFieldInput'

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
  incident?: ConnectedEntityInput

  @Field(() => EntityInfoFieldInput, { nullable: true })
  entityInfo?: EntityInfoFieldInput

  @Field(() => RelationshipInfoFieldInput, { nullable: true })
  relationshipInfo?: RelationshipInfoFieldInput
}
