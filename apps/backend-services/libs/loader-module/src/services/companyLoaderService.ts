import { Injectable } from '@nestjs/common'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CompanyAPIInput, UpdateSource } from 'defs'

@Injectable()
export class CompanyLoaderService {
  constructor(private readonly ingressService: IngressService) {}

  findCompany = async (searchFields: Partial<Record<keyof CompanyAPIInput, string>>) =>
    this.ingressService.findCompanyId(searchFields)

  createCompany = async (companyInfo: CompanyAPIInput, author: UpdateSource) =>
    this.ingressService.createEntity('COMPANY', companyInfo, author)

  updateCompany = async (entityId: string, companyInfo: CompanyAPIInput, author: UpdateSource) =>
    this.ingressService.updateEntity(
      {
        entityId,
        entityType: 'COMPANY',
      },
      companyInfo,
      author,
    )
}
