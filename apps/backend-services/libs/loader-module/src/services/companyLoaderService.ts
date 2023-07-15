import { Injectable } from '@nestjs/common'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CompanyAPIInput, UpdateSource } from 'defs'

@Injectable()
export class CompanyLoaderService {
  constructor(private readonly ingressService: IngressService) {}

  findCompany = async (
    name: string | null = null,
    cui: string | null = null,
    registrationNumber: string | null = null,
  ) => this.ingressService.findCompanyId({ cui, name, registrationNumber })

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
