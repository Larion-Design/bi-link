import { AssociateAPI } from 'defs'

export const countEntities = (associates: AssociateAPI[]) =>
  associates.reduce(
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

export const getShareholdersTotalEquity = (associates: AssociateAPI[]) => {
  let totalEquity = 0.0
  associates.forEach(({ equity: { value } }) => (totalEquity += value))
  return totalEquity.toFixed(2)
}
