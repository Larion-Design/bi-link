import { Field, InputType } from '@nestjs/graphql'
import { IsDate, IsOptional } from 'class-validator'
import { IdDocumentAPI, IdDocumentStatus } from '@app/definitions/idDocument'

@InputType()
export class IdDocumentInput implements IdDocumentAPI {
  @Field()
  readonly documentType: string

  @Field()
  readonly documentNumber: string

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  readonly issueDate?: Date

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  readonly expirationDate?: Date

  @Field(() => String)
  readonly status: IdDocumentStatus
}
