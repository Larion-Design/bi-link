import Box from '@mui/material/Box'
import React, { useEffect, useMemo } from 'react'
import { EntityType, TableAPI } from 'defs'
import { getCompanyInfoRequest } from '../../../../graphql/companies/queries/getCompany'
import { getPersonInfoRequest } from '../../../../graphql/persons/queries/getPersonInfo'
import { DropdownList } from '../../dropdownList'

type Props = {
  entityId?: string
  entityType?: EntityType
  tableInfo: TableAPI
  updateTable: (tableInfo: TableAPI) => void
}

export const ReportContentTable: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  tableInfo: { id },
  updateTable,
}) => {
  const [fetchPerson, { data: personData }] = getPersonInfoRequest()
  const [fetchCompany, { data: companyData }] = getCompanyInfoRequest()

  const options = useMemo(() => {
    switch (entityType) {
      case 'PERSON': {
        return { properties: 'Proprietati si bunuri', relationships: 'Relatii cu alte persoane' }
      }
      case 'COMPANY':
        return { properties: 'Proprietati si bunuri', associates: 'Asociati' }
      default:
        return {}
    }
  }, [entityType])

  useEffect(() => {
    if (entityId) {
      if (entityType === 'PERSON') {
        void fetchPerson({ variables: { personId: entityId } })
      } else if (entityType === 'COMPANY') {
        void fetchCompany({ variables: { id: entityId } })
      }
    }
  }, [entityId])

  const renderPersonTable = () => {
    switch (id) {
      case 'properties': {
        break
      }
      case 'relationships': {
        break
      }
    }
    return null
  }

  const renderCompanyTable = () => {
    switch (id) {
      case 'properties': {
        break
      }
      case 'associates': {
        break
      }
    }
    return null
  }

  return (
    <Box>
      <DropdownList value={id} options={options} onChange={(id) => updateTable({ id })} />

      <Box>
        {entityType === 'PERSON' && renderPersonTable()}
        {entityType === 'COMPANY' && renderCompanyTable()}
      </Box>
    </Box>
  )
}
