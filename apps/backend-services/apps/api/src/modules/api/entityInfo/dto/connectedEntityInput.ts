import { Field, InputType } from '@nestjs/graphql'
import { IsMongoId } from 'class-validator'
import { ConnectedEntity as ConnectedEntityType } from 'defs'

@InputType()
export class ConnectedEntityInput implements ConnectedEntityType {
  @IsMongoId()
  @Field()
  _id: string

  @Field({ nullable: true })
  _confirmed?: boolean
}
