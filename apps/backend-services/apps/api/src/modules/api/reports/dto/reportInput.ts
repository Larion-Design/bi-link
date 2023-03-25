import { Field, InputType } from '@nestjs/graphql'
import { ReportAPIInput } from 'defs'
import { ConnectedEntityInput } from '../../entityInfo/dto/connectedEntityInput'
import { DataRefInput } from './refs/dataRefInput'
import { ReportSectionInput } from './reportSectionInput'

@InputType()
export class ReportInput implements ReportAPIInput {
  @Field()
  readonly name: string

  @Field()
  readonly type: string

  @Field()
  readonly isTemplate: boolean

  @Field(() => [ReportSectionInput])
  readonly sections: ReportSectionInput[]

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly company?: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly person?: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly property?: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly event?: ConnectedEntityInput

  @Field(() => [DataRefInput])
  readonly refs: DataRefInput[]
}
