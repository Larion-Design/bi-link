import { Field, InputType, Int } from '@nestjs/graphql'
import { ReportContentAPIInput } from 'defs'
import { FileInput } from '../../files/dto/fileInput'
import { GraphInput } from './content/graphInput'
import { LinkInput } from './content/linkInput'
import { TableInput } from './content/tableInput'
import { TextInput } from './content/textInput'
import { TitleInput } from './content/titleInput'

@InputType()
export class ReportContentInput implements ReportContentAPIInput {
  @Field(() => Int)
  order: number

  @Field()
  isActive: boolean

  @Field(() => [FileInput], { nullable: true })
  images?: FileInput[]

  @Field(() => FileInput, { nullable: true })
  file?: FileInput

  @Field(() => TitleInput, { nullable: true })
  title?: TitleInput

  @Field(() => TextInput, { nullable: true })
  text?: TextInput

  @Field(() => LinkInput, { nullable: true })
  link?: LinkInput

  @Field(() => TableInput, { nullable: true })
  table?: TableInput

  @Field(() => GraphInput, { nullable: true })
  graph?: GraphInput
}
