import { Field, InputType } from '@nestjs/graphql'
import { OldNameAPIInput } from 'defs'

@InputType()
export class OldNameInput implements OldNameAPIInput {
  @Field()
  name: string

  @Field()
  changeReason: string
}
