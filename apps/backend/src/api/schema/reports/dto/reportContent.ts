import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ReportContentAPIOutput } from 'defs'
import { File } from '../../files/dto/file'
import { Graph } from './content/graph'
import { Link } from './content/link'
import { Table } from './content/table'
import { Text } from './content/text'
import { Title } from './content/title'

@ObjectType()
export class ReportContent implements ReportContentAPIOutput {
  @Field(() => Int)
  order: number

  @Field()
  isActive: boolean

  @Field(() => [File], { nullable: true })
  images?: File[]

  @Field(() => File, { nullable: true })
  file?: File

  @Field(() => Title, { nullable: true })
  title?: Title

  @Field(() => Text, { nullable: true })
  text?: Text

  @Field(() => Link, { nullable: true })
  link?: Link

  @Field(() => Table, { nullable: true })
  table?: Table

  @Field(() => Graph, { nullable: true })
  graph?: Graph
}
