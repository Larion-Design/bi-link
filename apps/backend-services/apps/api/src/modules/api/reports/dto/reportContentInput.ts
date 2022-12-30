import {Field, ObjectType} from '@nestjs/graphql'
import {ReportContent as ReportContentType} from 'defs'
import {FileInput} from '../../files/dto/fileInput'
import {LinkInput} from './linkInput'
import {TableInput} from './tableInput'
import {TextInput} from './textInput'
import {TitleInput} from './titleInput'

@ObjectType()
export class ReportContentInput implements ReportContentType {
  @Field()
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
