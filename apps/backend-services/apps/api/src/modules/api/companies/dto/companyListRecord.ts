import { CompanyListRecord as CompanyListRecordType } from 'defs'
import { ObjectType, PickType } from '@nestjs/graphql'
import { Company } from './company'

@ObjectType()
export class CompanyListRecord
  extends PickType(Company, ['_id', 'cui', 'name', 'registrationNumber'] as const)
  implements CompanyListRecordType {}
