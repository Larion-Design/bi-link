import { Injectable } from '@nestjs/common'
import { CompanyLoaderService, PersonLoaderService } from '@app/loader-module'
import { ProceedingEntityInvolvedAPI } from 'defs'
import {
  getDefaultCompany,
  getDefaultInvolvedCompany,
  getDefaultInvolvedPerson,
  getDefaultPerson,
  getDefaultProceeding,
} from 'tools'
import { AUTHOR } from '../../../constants'
import { TermeneInvolvedEntity, TermeneProceeding } from '../../../schema/courtFiles'
import { getProceedingUrl } from '../../extractor/helpers'

@Injectable()
export class ProceedingDataTransformer {
  constructor(
    private readonly companyLoaderService: CompanyLoaderService,
    private readonly personLoaderService: PersonLoaderService,
  ) {}

  async transformProceeding(proceedingInfo: TermeneProceeding) {
    const sourceUrl = getProceedingUrl(String(proceedingInfo.id))
    const proceeding = getDefaultProceeding()
    proceeding.metadata.trustworthiness.source = sourceUrl
    proceeding.name = `${proceedingInfo.nume_scurt_materie_juridica} ${proceedingInfo.data_dosar}`
    proceeding.year.value = new Date(proceedingInfo.data_dosar)
    proceeding.fileNumber.value = proceedingInfo.nr_dosar
    proceeding.type = proceedingInfo.obiect_afisare
    proceeding.entitiesInvolved = await this.resolveInvolvedEntities(
      proceedingInfo.parti,
      sourceUrl,
    )
    return proceeding
  }

  private async resolveInvolvedEntities(entitiesInfo: TermeneInvolvedEntity[], sourceUrl: string) {
    const entitiesInvolved: ProceedingEntityInvolvedAPI[] = []

    for await (const entityInfo of entitiesInfo) {
      switch (entityInfo.tip) {
        case 'PF': {
          const involvedPerson = await this.getInvolvedPerson(entityInfo, sourceUrl)

          if (involvedPerson) {
            entitiesInvolved.push(involvedPerson)
          }
          break
        }
        case 'PJ': {
          const involvedCompany = await this.getInvolvedCompany(entityInfo, sourceUrl)

          if (involvedCompany) {
            entitiesInvolved.push(involvedCompany)
          }
        }
      }
    }
    return entitiesInvolved
  }

  private async getInvolvedPerson(involvedEntity: TermeneInvolvedEntity, sourceUrl: string) {
    const personId = await this.getPerson(involvedEntity.denumire)

    if (personId) {
      return this.setInvolvedEntityInfo(
        getDefaultInvolvedPerson(personId),
        involvedEntity,
        sourceUrl,
      )
    }
  }

  private async getPerson(name: string) {
    const { firstName, lastName } = this.computePersonName(name)
    const existingPersonId = await this.personLoaderService.findPerson(firstName, lastName)

    if (!existingPersonId) {
      const personInfo = this.createPerson(firstName, lastName)
      return this.personLoaderService.createPerson(personInfo, AUTHOR)
    }
    return existingPersonId
  }

  private createPerson(firstName: string, lastName: string) {
    const personInfo = getDefaultPerson()
    personInfo.lastName.value = lastName
    personInfo.firstName.value = firstName
    return personInfo
  }

  private async getInvolvedCompany(involvedEntity: TermeneInvolvedEntity, sourceUrl: string) {
    const companyId = await this.getCompany(involvedEntity.denumire, String(involvedEntity.cui))

    if (companyId) {
      return this.setInvolvedEntityInfo(
        getDefaultInvolvedCompany(companyId),
        involvedEntity,
        sourceUrl,
      )
    }
  }

  private getCompany = async (name: string, cui: string) => {
    const existingCompanyId = await this.companyLoaderService.findCompany(null, cui)

    if (!existingCompanyId) {
      const companyInfo = this.createCompany(name, cui)
      return this.companyLoaderService.createCompany(companyInfo, AUTHOR)
    }
    return existingCompanyId
  }

  private createCompany = (name: string, cui: string) => {
    const companyInfo = getDefaultCompany()
    companyInfo.name.value = name
    companyInfo.cui.value = cui
    return companyInfo
  }

  private setInvolvedEntityInfo(
    entityInvolved: ProceedingEntityInvolvedAPI,
    partyInfo: TermeneInvolvedEntity,
    sourceUrl: string,
  ) {
    entityInvolved.involvedAs = partyInfo.calitate
    entityInvolved.metadata.trustworthiness.source = sourceUrl
    return entityInvolved
  }

  private computePersonName(name: string) {
    const [lastName = '', ...firstNames] = name.split(' ')
    return { lastName, firstName: firstNames.join(' ') }
  }
}
