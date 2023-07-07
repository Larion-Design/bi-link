import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { IngressService } from '@app/rpc/microservices/ingress'
import { Injectable } from '@nestjs/common'
import { BalanceSheet, CustomFieldAPI } from 'defs'
import { getDefaultBalanceSheet, getDefaultCompany, getDefaultCustomField } from 'tools'
import { TermeneAssociatesSchema } from '../../../schema/associates'
import { CompanyTermeneDataset } from '../../../schema/company'
import { getCompanyUrl } from '../../extractor/helpers'
import { AssociateDataTransformerService } from './associateDataTransformerService'
import { LocationDataTransformerService } from './locationDataTransformerService'

@Injectable()
export class CompanyDataTransformerService {
  constructor(
    private readonly ingressService: IngressService,
    private readonly indexerService: IndexerService,
    private readonly associateDataTransformerService: AssociateDataTransformerService,
    private readonly locationDataTransformerService: LocationDataTransformerService,
  ) {}

  transformCompanyData(cui: string, data: CompanyTermeneDataset) {
    const companyInfo = getDefaultCompany()
    const sourceUrl = getCompanyUrl(cui)

    companyInfo.metadata.trustworthiness.source = sourceUrl

    const name = data.headerInfo?.firma.nume_canonic ?? ''

    if (name.length) {
      companyInfo.name.value = name
      companyInfo.name.metadata.trustworthiness.source = sourceUrl
    }

    companyInfo.cui.value = cui
    companyInfo.cui.metadata.trustworthiness.source = sourceUrl

    const registrationNumber = data.headerInfo?.firma.j ?? ''

    if (registrationNumber.length) {
      companyInfo.registrationNumber.value = registrationNumber
      companyInfo.registrationNumber.metadata.trustworthiness.source = sourceUrl
    }

    companyInfo.headquarters =
      this.locationDataTransformerService.transformHeadquartersData(data) ?? null
    companyInfo.locations = this.locationDataTransformerService.transformBranchesData(data)
    companyInfo.customFields = this.setCustomFields(data, sourceUrl)
    companyInfo.contactDetails = this.setContactDetails(data, sourceUrl)
    companyInfo.activityCodes = this.setActivityCodes(data, sourceUrl)
    companyInfo.balanceSheets = this.setBalanceSheets(data, sourceUrl)

    if (data.headerInfo?.statut_tva) {
      companyInfo.status.vat.value = data.headerInfo.statut_tva.curent.label
      companyInfo.status.vat.metadata.trustworthiness.source = sourceUrl
    }

    if (data.headerInfo?.statut_fiscal) {
      companyInfo.status.fiscal.value = data.headerInfo.statut_fiscal.curent.label
      companyInfo.status.fiscal.metadata.trustworthiness.source = sourceUrl
    }

    if (data.headerInfo?.stare_firma) {
      const { recom, mfinante } = data.headerInfo.stare_firma

      if (mfinante) {
        companyInfo.active.ministryOfFinance.value = mfinante.curenta.functiune
        companyInfo.active.ministryOfFinance.metadata.trustworthiness.source = sourceUrl
      }

      if (recom) {
        companyInfo.active.tradeRegister.value = recom.curenta.functiune
        companyInfo.active.tradeRegister.metadata.trustworthiness.source = sourceUrl
      }
    }
    return companyInfo
  }

  async transformAssociates(cui: string, associates: TermeneAssociatesSchema) {
    const {
      asociatiAdministratori: { administratori, asociati },
    } = associates

    return this.associateDataTransformerService.transformAssociatesInfo(
      [...administratori, ...asociati],
      getCompanyUrl(cui),
    )
  }

  private setActivityCodes(data: CompanyTermeneDataset, sourceUrl: string) {
    const codes = new Set<number | string>()
    const mainCAEN = data.profileInfo?.cod_caen.principal_mfinante
    const activityCodes: CustomFieldAPI[] = []

    if (mainCAEN) {
      codes.add(mainCAEN.cod)
      activityCodes.push(this.createCustomField(sourceUrl, String(mainCAEN.cod), mainCAEN.label))
    }

    data.caen?.cod_caen.secundare_recom.lista.forEach(({ cod, label }) => {
      if (!codes.has(cod)) {
        codes.add(cod)
        this.createCustomField(sourceUrl, String(cod), label)
      }
    })

    return activityCodes
  }

  private setContactDetails({ contactDetails }: CompanyTermeneDataset, sourceUrl: string) {
    const contactDetailsList: CustomFieldAPI[] = []

    contactDetails?.Web?.split(',').forEach((website) => {
      contactDetailsList.push(this.createCustomField(sourceUrl, 'Website', website))
    })

    contactDetails?.Telefon?.split(',').forEach((phoneNumber) =>
      contactDetailsList.push(this.createCustomField(sourceUrl, 'Website', phoneNumber)),
    )
    return contactDetailsList
  }

  private setCustomFields = (data: CompanyTermeneDataset, sourceUrl: string) => {
    const customFields: CustomFieldAPI[] = [
      this.setCompanyStatus(data, sourceUrl),
      ...this.setCompanyFicalStatus(data, sourceUrl),
    ]
    return customFields
  }

  private setBalanceSheets = (data: CompanyTermeneDataset, sourceUrl: string) =>
    data?.balanceSheet?.balanceSheet.map((balanceSheetInfo) => {
      const balanceSheet: BalanceSheet = {
        ...getDefaultBalanceSheet(),
        year: new Date(balanceSheetInfo.an),
        activityCode: balanceSheetInfo.cod_caen,
        averageEmployees: balanceSheetInfo.numar_mediu_angajati,
        activityType: balanceSheetInfo.tip_activitate,
        receivables: balanceSheetInfo.creante ?? 0,
        balanceType: balanceSheetInfo.tip_bilant,
        socialCapital: balanceSheetInfo.capital_social ?? 0,
        totalCapital: balanceSheetInfo.capital_total ?? 0,
        totalExpenses: balanceSheetInfo.cheltuieli_totale ?? 0,
        totalRevenue: balanceSheetInfo.venituri_total ?? 0,
        revenueAdvance: balanceSheetInfo.venituri_in_avans ?? 0,
        expensesAdvance: balanceSheetInfo.cheltuieli_in_avant ?? 0,
        currentAssets: balanceSheetInfo.active_circulante ?? 0,
        fixedAssets: balanceSheetInfo.active_imobilizate ?? 0,
        royaltyHeritage: balanceSheetInfo.patrimoniu_regie ?? 0,
        publicHeritage: balanceSheetInfo.patrimoniu_public ?? 0,
        houseAndAccountsSeizedByBanks: balanceSheetInfo.casa_si_conturi_la_banci ?? 0,
        debt: balanceSheetInfo.datorii ?? 0,
        netLoss: balanceSheetInfo.pierdere_net ?? 0,
        grossLoss: balanceSheetInfo.pierdere_brut ?? 0,
        grossProfit: balanceSheetInfo.profit_brut ?? 0,
        netProfit: balanceSheetInfo.profit_net ?? 0,
        provisions: balanceSheetInfo.provizioane ?? 0,
        inventories: balanceSheetInfo.stocuri ?? 0,
        netBusinessFigure: balanceSheetInfo.cifra_de_afaceri_neta ?? 0,
      }

      balanceSheet.metadata.trustworthiness.source = sourceUrl
      return balanceSheet
    }) ?? ([] as BalanceSheet[])

  private setCompanyStatus = (data: CompanyTermeneDataset, sourceUrl: string) =>
    this.createCustomField(
      sourceUrl,
      'Status',
      data.headerInfo?.stare_firma.mfinante.curenta.functiune ? 'Activa' : 'Inactiva',
    )

  private setCompanyFicalStatus = (data: CompanyTermeneDataset, sourceUrl: string) => [
    this.createCustomField(
      sourceUrl,
      'Statut fiscal',
      data.headerInfo?.statut_fiscal.curent.label ?? '',
    ),
    this.createCustomField(sourceUrl, 'Statut TVA', data.headerInfo?.statut_tva.curent.label ?? ''),
  ]

  private createCustomField = (sourceUrl: string, fieldName: string, fieldValue: string) => {
    const customField = getDefaultCustomField()
    customField.metadata.trustworthiness.source = sourceUrl
    customField.fieldName = fieldName
    customField.fieldValue = fieldValue
    return customField
  }
}
