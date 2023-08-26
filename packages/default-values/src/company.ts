import { AssociateAPI, BalanceSheet, CompanyAPIInput } from 'defs'
import { getDefaultLocation } from './location'
import { getDefaultMetadata } from './metadata'
import {
  getDefaultBooleanWithMetadata,
  getDefaultNumberWithMetadata,
  getDefaultOptionalDateWithMetadata,
  getDefaultTextWithMetadata,
} from './valueWithMetadata'

export const getDefaultCompany = (): CompanyAPIInput => ({
  metadata: getDefaultMetadata(),
  name: getDefaultTextWithMetadata(),
  cui: getDefaultTextWithMetadata(),
  registrationNumber: getDefaultTextWithMetadata(),
  headquarters: getDefaultLocation(),
  balanceSheets: [],
  associates: [],
  contactDetails: [],
  customFields: [],
  locations: [],
  files: [],
  registrationDate: getDefaultOptionalDateWithMetadata(),
  status: {
    vat: getDefaultTextWithMetadata(),
    fiscal: getDefaultTextWithMetadata(),
  },
  active: {
    ministryOfFinance: getDefaultBooleanWithMetadata(),
    tradeRegister: getDefaultBooleanWithMetadata(),
  },
  activityCodes: [],
})

export const getDefaultAssociate = (): AssociateAPI => ({
  metadata: getDefaultMetadata(),
  role: getDefaultTextWithMetadata(),
  startDate: getDefaultOptionalDateWithMetadata(),
  endDate: getDefaultOptionalDateWithMetadata(),
  equity: getDefaultNumberWithMetadata(),
  isActive: getDefaultBooleanWithMetadata(),
  customFields: [],
})

export const getDefaultPersonAssociate = (_id: string): AssociateAPI => ({
  ...getDefaultAssociate(),
  person: { _id },
})

export const getDefaultCompanyAssociate = (_id: string): AssociateAPI => ({
  ...getDefaultAssociate(),
  company: { _id },
})

export const getDefaultBalanceSheet = (): BalanceSheet => ({
  metadata: getDefaultMetadata(),
  year: null,
  fixedAssets: 0,
  currentAssets: 0,
  inventories: 0,
  receivables: 0,
  houseAndAccountsSeizedByBanks: 0,
  expensesAdvance: 0,
  debt: 0,
  revenueAdvance: 0,
  provisions: 0,
  totalCapital: 0,
  socialCapital: 0,
  royaltyHeritage: 0,
  publicHeritage: 0,
  netBusinessFigure: 0,
  totalRevenue: 0,
  totalExpenses: 0,
  grossProfit: 0,
  grossLoss: 0,
  netProfit: 0,
  netLoss: 0,
  averageEmployees: 0,
  activityCode: 0,
  activityType: '',
  balanceType: '',
})
