import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import { EntityType, TableAPI } from 'defs'
import { getPersonInfoRequest } from '../../../../graphql/persons/queries/getPersonInfo'
import { AssociatesTable } from '../../../reports/tables/associatesTable'
import { PropertiesTable } from '../../../reports/tables/propertiesTable'
import { RelationshipsTable } from '../../../reports/tables/relationshipsTable'
import { DropdownList } from '../../dropdownList'

type Props = {
  entityId?: string
  entityType?: EntityType
  tableInfo: TableAPI
  updateTable: (tableInfo: TableAPI) => void
}

type PredefinedTables = 'properties' | 'associates' | 'relationships'

export const ReportContentTable: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  tableInfo: { id },
  updateTable,
}) => {
  const [fetchPerson, { data: personData }] = getPersonInfoRequest()

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

  const renderPersonTable = () => {
    switch (id as PredefinedTables) {
      case 'properties': {
        return <PropertiesTable entityId={entityId} entityType={'PERSON'} />
      }
      case 'relationships': {
        return <RelationshipsTable personId={entityId} />
      }
    }
    return null
  }

  const renderCompanyTable = () => {
    switch (id as PredefinedTables) {
      case 'properties': {
        return <PropertiesTable entityId={entityId} entityType={'COMPANY'} />
      }
      case 'associates': {
        return <AssociatesTable companyId={entityId} />
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
