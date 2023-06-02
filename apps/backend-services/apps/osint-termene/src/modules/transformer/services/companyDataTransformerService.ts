import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { IngressService } from '@app/rpc/microservices/ingress'
import { Injectable } from '@nestjs/common'
import { CustomFieldAPI } from 'defs'
import { getDefaultCompany, getDefaultCustomField } from 'tools'
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

  public transformCompanyData = (cui: string, data: CompanyTermeneDataset) => {
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
    return companyInfo
  }

  transformAssociates = async (cui: string, dataset: CompanyTermeneDataset) => {
    const { associates } = dataset

    if (
      associates?.asociatiAdministratori.administratori.length &&
      associates?.asociatiAdministratori.asociati.length
    ) {
      const sourceUrl = getCompanyUrl(cui)
      return this.associateDataTransformerService.transformAssociatesInfo(associates, sourceUrl)
    }
    return []
  }

  private setCAENCodes = (data: CompanyTermeneDataset, sourceUrl: string): CustomFieldAPI => {
    const codes = new Set<string>()
    const mainCAEN = data.profileInfo?.cod_caen.principal_mfinante

    if (mainCAEN) {
      codes.add(`${mainCAEN.cod} - ${mainCAEN.label}`)
    }

    data.caen?.cod_caen.secundare_recom.lista.forEach(({ cod, label }) => {
      codes.add(`${cod} - ${label}`)
    })

    return this.createCustomField(
      sourceUrl,
      'CAEN',
      Array.from(codes).join(String.fromCharCode(13, 10)).trim(),
    )
  }

  private setContactDetails = (data: CompanyTermeneDataset, sourceUrl: string) => {
    const contactDetails: CustomFieldAPI[] = []

    data.contactDetails?.Web?.split(',').forEach((website) =>
      this.createCustomField(sourceUrl, 'Website', website),
    )

    data.contactDetails?.Telefon?.split(',').forEach((phoneNumber) =>
      this.createCustomField(sourceUrl, 'Telefon', phoneNumber),
    )
    return contactDetails
  }

  private setCustomFields = (data: CompanyTermeneDataset, sourceUrl: string) => {
    const customFields: CustomFieldAPI[] = [
      this.setCompanyStatus(data, sourceUrl),
      this.setCAENCodes(data, sourceUrl),
      ...this.setCompanyFicalStatus(data, sourceUrl),
      ...this.setBalanceSheets(data, sourceUrl),
    ]
    return customFields
  }

  private setBalanceSheets = (data: CompanyTermeneDataset, sourceUrl: string): CustomFieldAPI[] =>
    data.balanceSheet?.balanceSheet.map((balanceSheet) =>
      this.createCustomField(
        sourceUrl,
        `Bilant ${balanceSheet.an}`,
        Array.from([
          `Cod CAEN: ${balanceSheet.cod_caen}`,
          `Tip activitate: ${balanceSheet.tip_activitate ?? 0}`,
          `Capital social: ${balanceSheet.capital_social ?? 0}`,
          `Capital total: ${balanceSheet.capital_total ?? 0}`,
          `Active circulante: ${balanceSheet.active_circulante ?? 0}`,
          `Active Imobilizate: ${balanceSheet.active_imobilizate ?? 0}`,
          `Case si conturi la banci: ${balanceSheet.casa_si_conturi_la_banci ?? 0}`,
          `Cheltuieli in avans: ${balanceSheet.cheltuieli_in_avant ?? 0}`,
          `Cheltuieli totale: ${balanceSheet.cheltuieli_totale ?? 0}`,
          `Cifra de afaceri neta: ${balanceSheet.cifra_de_afaceri_neta ?? 0}`,
          `Datorii: ${balanceSheet.datorii ?? 0}`,
          `Creante: ${balanceSheet.creante ?? 0}`,
          `Nr. mediu angajati: ${balanceSheet.numar_mediu_angajati ?? 0}`,
          `Patrimoniu public: ${balanceSheet.patrimoniu_public ?? 0}`,
          `Patrimoniu regie: ${balanceSheet.patrimoniu_regie ?? 0}`,
          `Pierderi brute: ${balanceSheet.pierdere_brut ?? 0}`,
          `Pierderi nete: ${balanceSheet.pierdere_net ?? 0}`,
          `Provizioane: ${balanceSheet.provizioane ?? 0}`,
          `Profit net: ${balanceSheet.profit_net ?? 0}`,
          `Profit brut: ${balanceSheet.profit_brut ?? 0}`,
          `Profit sau pierdere bruta: ${balanceSheet.profit_pierdere_bruta ?? 0}`,
          `Profit sau pierdere neta: ${balanceSheet.profitul_sau_pierdere_neta ?? 0}`,
          `Venituri in avans: ${balanceSheet.venituri_in_avans ?? 0}`,
          `Venituri totale: ${balanceSheet.venituri_total ?? 0}`,
          `Stocuri: ${balanceSheet.stocuri ?? 0}`,
        ])
          .join(String.fromCharCode(13, 10))
          .trim(),
      ),
    ) ?? []

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
