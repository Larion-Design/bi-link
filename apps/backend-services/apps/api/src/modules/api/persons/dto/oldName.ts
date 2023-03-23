import { Field, ObjectType } from '@nestjs/graphql'
import { OldNameAPIOutput } from 'defs'

@ObjectType()
export class OldName implements OldNameAPIOutput {
  @Field()
  name: string

  @Field()
  changeReason: string
}
