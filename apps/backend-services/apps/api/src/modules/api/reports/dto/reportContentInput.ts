import { Field, InputType, Int } from '@nestjs/graphql'
import { ReportContentAPIInput } from 'defs'
import { FileInput } from '../../files/dto/fileInput'
import { LinkInput } from './linkInput'
import { TableInput } from './tableInput'
import { TextInput } from './textInput'
import { TitleInput } from './titleInput'

@InputType()
export class ReportContentInput implements ReportContentAPIInput {
  @Field(() => Int)
  order: number

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
}
