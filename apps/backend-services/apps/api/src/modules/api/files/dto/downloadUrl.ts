import { Field, ObjectType } from '@nestjs/graphql'
import { DownloadUrl as DownloadUrlType } from '@app/definitions/file'

@ObjectType()
export class DownloadUrl implements DownloadUrlType {
  @Field()
  url: string

  @Field()
  ttl: number
}
