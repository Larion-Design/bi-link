import { CompanyIndex, BalanceSheetIndex } from '@modules/definitions';
import { MappingInterface } from './mapping';
import { MappingHelperService } from './mappingHelperService';
import { Injectable } from '@nestjs/common';
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class CompaniesMappingService implements MappingInterface<CompanyIndex> {
  constructor(private readonly mappingHelperService: MappingHelperService) {}

  getMapping = (): Record<keyof CompanyIndex, MappingProperty> => ({
    name: this.mappingHelperService.textField,
    cui: this.mappingHelperService.keywordField,
    registrationNumber: this.mappingHelperService.keywordField,
    headquarters: this.mappingHelperService.textField,
    locations: this.mappingHelperService.textField,
    files: this.mappingHelperService.files,
    contactDetails: this.mappingHelperService.customFields,
    associatedPersons: this.mappingHelperService.connectedPerson,
    associatedCompanies: this.mappingHelperService.connectedCompany,
    customFields: this.mappingHelperService.customFields,
    activityCodes: this.mappingHelperService.customFields,
    balanceSheets: {
      type: 'nested',
      properties: this.getBalanceSheetMapping(),
    },
  });

  private getBalanceSheetMapping = (): Record<
    keyof BalanceSheetIndex,
    MappingProperty
  > => ({
    year: this.mappingHelperService.integerField,
    fixedAssets: this.mappingHelperService.integerField,
    currentAssets: this.mappingHelperService.integerField,
    inventories: this.mappingHelperService.integerField,
    receivables: this.mappingHelperService.integerField,
    houseAndAccountsSeizedByBanks: this.mappingHelperService.integerField,
    expensesAdvance: this.mappingHelperService.integerField,
    debt: this.mappingHelperService.integerField,
    revenueAdvance: this.mappingHelperService.integerField,
    provisions: this.mappingHelperService.integerField,
    totalCapital: this.mappingHelperService.integerField,
    socialCapital: this.mappingHelperService.integerField,
    royaltyHeritage: this.mappingHelperService.integerField,
    publicHeritage: this.mappingHelperService.integerField,
    netBusinessFigure: this.mappingHelperService.integerField,
    totalRevenue: this.mappingHelperService.integerField,
    totalExpenses: this.mappingHelperService.integerField,
    grossProfit: this.mappingHelperService.integerField,
    grossLoss: this.mappingHelperService.integerField,
    netProfit: this.mappingHelperService.integerField,
    netLoss: this.mappingHelperService.integerField,
    averageEmployees: this.mappingHelperService.integerField,
    activityCode: this.mappingHelperService.integerField,
    activityType: this.mappingHelperService.keywordField,
    balanceType: this.mappingHelperService.keywordField,
  });
}
