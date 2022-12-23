import { Field, ObjectType } from '@nestjs/graphql'
import { DownloadUrl } from './downloadUrl'
import { FileAPIOutput } from '@app/definitions/file'

@ObjectType()
export class File implements FileAPIOutput {
  @Field()
  fileId: string

  @Field(() => DownloadUrl)
  url?: DownloadUrl

  @Field({ nullable: true, defaultValue: '' })
  name: string

  @Field({ nullable: true, defaultValue: '' })
  description: string

  @Field()
  isHidden: boolean
}
