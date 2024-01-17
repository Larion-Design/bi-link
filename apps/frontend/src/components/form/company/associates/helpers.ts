import { CompanyAssociateInfoState } from 'state/company/companyAssociatesState'

export const countEntities = (associates: Map<string, CompanyAssociateInfoState>) =>
  Array.from(associates.values()).reduce(
    (entitiesCount, { person, company }) => {
      if (person?._id) {
        entitiesCount.persons += 1
      } else if (company?._id) {
        entitiesCount.companies += 1
      }
      return entitiesCount
    },
    {
      persons: 0,
      companies: 0,
    },
  )

export const getShareholdersTotalEquity = (associates: Map<string, CompanyAssociateInfoState>) => {
  let totalEquity = 0.0
  associates.forEach(({ equity: { value } }) => (totalEquity += value))
  return totalEquity.toFixed(2)
}
