import { CompanyLoaderService, PersonLoaderService } from '@app/loader-module'
import { Injectable } from '@nestjs/common'
import { AssociateAPI } from 'defs'
import {
  getDefaultCompany,
  getDefaultCompanyAssociate,
  getDefaultPerson,
  getDefaultPersonAssociate,
} from 'tools'
import { AUTHOR } from '../../../constants'
import {
  TermeneAssociatesSchema,
  TermeneCompanyAssociate,
  TermenePersonAssociate,
} from '../../../schema/associates'
import { LocationDataTransformerService } from './locationDataTransformerService'

@Injectable()
export class AssociateDataTransformerService {
  constructor(
    private readonly locationDataTransformerService: LocationDataTransformerService,
    private readonly personLoaderService: PersonLoaderService,
    private readonly companyLoaderService: CompanyLoaderService,
  ) {}

  transformAssociatesInfo = async (associates: TermeneAssociatesSchema, sourceUrl: string) =>
    Promise.all(
      [
        ...associates.asociatiAdministratori.administratori,
        ...associates.asociatiAdministratori.asociati,
      ].map((associate) => {
        switch (associate.tipAA) {
          case 'firma':
            return this.getCompanyAssociate(associate, sourceUrl)
          case 'persoana':
            return this.getPersonAssociate(associate, sourceUrl)
        }
        return Promise.reject()
      }),
    )

  private getCompanyAssociate = async (
    associateInfo: TermeneCompanyAssociate,
    sourceUrl: string,
  ) => {
    const existingCompanyId = await this.companyLoaderService.findCompany(null, associateInfo.cui)

    if (!existingCompanyId) {
      const companyInfo = this.createCompany(associateInfo)
      const companyId = await this.companyLoaderService.createCompany(companyInfo, AUTHOR)

      if (companyId) {
        return this.setAssociateInfo(
          getDefaultCompanyAssociate(companyId),
          associateInfo,
          sourceUrl,
        )
      }
    }
  }

  private createCompany = ({ cui, adresa, nume, entityUrl }: TermeneCompanyAssociate) => {
    const companyInfo = getDefaultCompany()
    companyInfo.name.value = nume
    companyInfo.cui.value = cui
    companyInfo.headquarters = this.locationDataTransformerService.getAddress(adresa, entityUrl)

    if (entityUrl) {
      companyInfo.name.metadata.trustworthiness.source = entityUrl
      companyInfo.cui.metadata.trustworthiness.source = entityUrl
    }
    return companyInfo
  }

  private getPersonAssociate = async (associateInfo: TermenePersonAssociate, sourceUrl: string) => {
    const { firstName, lastName } = this.computePersonName(associateInfo.nume)
    const existingPersonId = await this.personLoaderService.findPerson(firstName, lastName)

    if (!existingPersonId) {
      const personInfo = this.createPerson(associateInfo)

      if (personInfo) {
        const personId = await this.personLoaderService.createPerson(personInfo, AUTHOR)

        if (personId) {
          return this.setAssociateInfo(
            getDefaultPersonAssociate(personId),
            associateInfo,
            sourceUrl,
          )
        }
      }
    }
  }

  private createPerson = ({ nume, dataNastere, entityUrl, adresa }: TermenePersonAssociate) => {
    const personInfo = getDefaultPerson()
    const { lastName, firstName } = this.computePersonName(nume)

    personInfo.firstName.value = firstName
    personInfo.lastName.value = lastName
    personInfo.birthdate.value = new Date(dataNastere)
    personInfo.homeAddress = this.locationDataTransformerService.getAddress(adresa)

    if (entityUrl) {
      personInfo.firstName.metadata.trustworthiness.source = entityUrl
      personInfo.lastName.metadata.trustworthiness.source = entityUrl
      personInfo.birthdate.metadata.trustworthiness.source = entityUrl
    }
    return personInfo
  }

  private computePersonName = (name: string) => {
    const parts = name.split(' ')
    const [lastName, ...firstNames] = parts

    return {
      lastName: lastName ?? '',
      firstName: firstNames.join(' '),
    }
  }

  private setAssociateInfo = (
    associate: AssociateAPI,
    { procentaj, functiune, functie }: TermenePersonAssociate | TermeneCompanyAssociate,
    sourceUrl: string,
  ): AssociateAPI => {
    associate.equity.value = parseFloat(String(procentaj))
    associate.role.value = functie
    associate.isActive.value = functiune

    associate.equity.metadata.trustworthiness.source = sourceUrl
    associate.role.metadata.trustworthiness.source = sourceUrl
    associate.isActive.metadata.trustworthiness.source = sourceUrl

    associate.startDate.value = null
    associate.endDate.value = null
    return associate
  }
}
