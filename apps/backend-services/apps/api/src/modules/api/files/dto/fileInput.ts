import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsUUID } from 'class-validator'
import { FileAPIInput } from '@app/definitions/file'

@InputType()
export class FileInput implements FileAPIInput {
  @IsUUID()
  @Field()
  readonly fileId: string

  @IsOptional()
  @Field({ nullable: true })
  readonly name: string

  @IsOptional()
  @Field({ nullable: true })
  readonly description: string

  @Field({ nullable: true, defaultValue: false })
  readonly isHidden: boolean
}
