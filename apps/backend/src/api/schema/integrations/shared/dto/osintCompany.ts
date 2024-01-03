import { Field, ObjectType } from '@nestjs/graphql'
import { OSINTCompany as OSINTCompanyType } from 'defs'

@ObjectType()
export class OSINTCompany implements OSINTCompanyType {
  @Field()
  cui: string

  @Field()
  name: string

  @Field({ nullable: true })
  headquarters: string

  @Field({ nullable: true })
  registrationNumber: string
}
