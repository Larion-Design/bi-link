import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ReportContent as ReportContentType } from 'defs'
import { File } from '../../files/dto/file'
import { Graph } from './graph'
import { Link } from './link'
import { Table } from './table'
import { Text } from './text'
import { Title } from './title'

@ObjectType()
export class ReportContent implements ReportContentType {
  @Field(() => Int)
  order: number

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
