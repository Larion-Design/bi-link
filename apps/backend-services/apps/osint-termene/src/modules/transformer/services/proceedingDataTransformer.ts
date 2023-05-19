import { Injectable } from '@nestjs/common'
import {
  CompanyLoaderService,
  PersonLoaderService,
  ProceedingLoaderService,
} from '@app/loader-module'
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

@Injectable()
export class ProceedingDataTransformer {
  constructor(
    private readonly proceedingLoaderService: ProceedingLoaderService,
    private readonly companyLoaderService: CompanyLoaderService,
    private readonly personLoaderService: PersonLoaderService,
  ) {}

  transformProceedings = async (proceedings: TermeneProceeding[], sourceUrl: string) =>
    Promise.all(
      proceedings.map(async (proceeding) => this.transformProceeding(proceeding, sourceUrl)),
    )

  transformProceeding = async (proceedingInfo: TermeneProceeding, sourceUrl: string) => {
    const existingProceedingId = await this.proceedingLoaderService.findProceeding(
      proceedingInfo.nr_dosar,
    )

    if (!existingProceedingId) {
      const proceeding = await this.createProceeding(proceedingInfo, sourceUrl)
      return this.proceedingLoaderService.createProceeding(proceeding, AUTHOR)
    }
  }

  private createProceeding = async (proceedingInfo: TermeneProceeding, sourceUrl: string) => {
    const proceeding = getDefaultProceeding()
    proceeding.metadata.trustworthiness.source = this.getProceedingUrl(String(proceedingInfo.id))
    proceeding.name = `${proceedingInfo.nume_scurt_materie_juridica} ${proceedingInfo.data_dosar}`
    proceeding.year.value = new Date(proceedingInfo.data_dosar)
    proceeding.fileNumber.value = proceedingInfo.nr_dosar
    proceeding.type = proceedingInfo.obiect_afisare
    proceeding.entitiesInvolved = (await Promise.all(
      proceedingInfo.parti.map(async (involvedEntityInfo) => {
        switch (involvedEntityInfo.tip) {
          case 'PF':
            return this.getInvolvedPerson(involvedEntityInfo, sourceUrl)
          case 'PJ':
            return this.getInvolvedCompany(involvedEntityInfo, sourceUrl)
        }
        return Promise.reject()
      }),
    )) as ProceedingEntityInvolvedAPI[]
    return proceeding
  }

  private getInvolvedPerson = async (involvedEntity: TermeneInvolvedEntity, sourceUrl: string) => {
    const personId = await this.getPerson(involvedEntity.denumire)

    if (personId) {
      return this.setInvolvedEntityInfo(
        getDefaultInvolvedPerson(personId),
        involvedEntity,
        sourceUrl,
      )
    }
  }

  private getPerson = async (name: string) => {
    const { firstName, lastName } = this.computePersonName(name)
    const existingPersonId = await this.personLoaderService.findPerson(firstName, lastName)

    if (!existingPersonId) {
      const personInfo = this.createPerson(firstName, lastName)
      return this.personLoaderService.createPerson(personInfo, AUTHOR)
    }
    return existingPersonId
  }

  private createPerson = (firstName: string, lastName: string) => {
    const personInfo = getDefaultPerson()
    personInfo.lastName.value = lastName
    personInfo.firstName.value = firstName
    return personInfo
  }

  private getInvolvedCompany = async (involvedEntity: TermeneInvolvedEntity, sourceUrl: string) => {
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

  private setInvolvedEntityInfo = (
    entityInvolved: ProceedingEntityInvolvedAPI,
    partyInfo: TermeneInvolvedEntity,
    sourceUrl: string,
  ) => {
    entityInvolved.involvedAs = partyInfo.calitate
    entityInvolved.metadata.trustworthiness.source = sourceUrl
    return entityInvolved
  }

  private getProceedingUrl = (id: string) => `https://termene.ro/detalii_dosar_modular/${id}`

  private computePersonName = (name: string) => {
    const parts = name.split(' ')
    const [lastName, ...firstNames] = parts

    return {
      lastName: lastName ?? '',
      firstName: firstNames.join(' '),
    }
  }
}
